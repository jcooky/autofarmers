import { runRequestSchema } from '@/data/api';
import {
  AgentNetworkClient,
  GetAgentRuntimeInfoRequest,
  GetAgentRuntimeInfoResponse,
} from '@/proto/network';
import { RunRequest, AgentRuntimeClient } from '@/proto/runtime';
import { ChannelCredentials } from '@grpc/grpc-js';
import { NextRequest, NextResponse } from 'next/server';
import { agentSchema } from '@/data/agents';
import { z } from 'zod';

export async function GET(): Promise<NextResponse> {
  const networkClient = new AgentNetworkClient(
    process.env.NETWORK_GRPC_ADDR!,
    ChannelCredentials.createInsecure(),
  );

  const { agentRuntimeInfoList: runtimeInfoList } =
    await new Promise<GetAgentRuntimeInfoResponse.AsObject>(
      (resolve, reject) => {
        const r = new GetAgentRuntimeInfoRequest();
        r.setAll(true);
        networkClient.getAgentRuntimeInfo(r, (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value!.toObject());
          }
        });
      },
    );

  return NextResponse.json<Record<string, z.infer<typeof agentSchema>>>(
    Object.fromEntries(
      runtimeInfoList.map((t) => {
        if (!t.info) {
          throw new Error(`Invalid agents runtime info`);
        }

        const metadata = Object.fromEntries(t.info.metadataMap);
        return [
          t.info.name.toLowerCase(),
          {
            name: t.info.name,
            role: t.info.role,
            state: 'idle',
            profileImage: metadata['profileImage'],
          },
        ];
      }),
    ),
  );
}

export async function POST(request: NextRequest) {
  const { threadId, agentNames } = runRequestSchema.parse(await request.json());
  const networkClient = new AgentNetworkClient(
    process.env.NETWORK_GRPC_ADDR!,
    ChannelCredentials.createInsecure(),
  );

  const runtimeInfo = await new Promise<GetAgentRuntimeInfoResponse>(
    (resolve, reject) => {
      const req = new GetAgentRuntimeInfoRequest();
      req.setNamesList(agentNames);
      networkClient.getAgentRuntimeInfo(req, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value!);
        }
      });
    },
  ).then((resp) => {
    const r = resp.toObject();
    return r.agentRuntimeInfoList;
  });

  console.log('Thread ID:', threadId);
  console.log('Agent names:', agentNames);
  console.log('Runtime info:', runtimeInfo);

  try {
    await Promise.all(
      runtimeInfo.map(async ({ addr, info }) => {
        if (!info) {
          console.error(`Agent not found`);
          return;
        }
        const agentRuntimeClient = new AgentRuntimeClient(
          addr,
          ChannelCredentials.createInsecure(),
        );

        await new Promise<void>((resolve, reject) => {
          const r = new RunRequest();
          r.setThreadId(threadId);
          r.setAgentNamesList([info.name]);

          console.log('run request:', r.toObject());
          agentRuntimeClient.run(r, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        agentRuntimeClient.close();
      }),
    );

    return Response.json({ message: 'Agents running successfully' });
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json({ error: 'Failed to add message' }, { status: 500 });
  }
}
