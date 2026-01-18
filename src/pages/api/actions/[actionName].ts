import type { APIRoute } from 'astro';
import type { ActionResult } from '../../../types';

export const POST: APIRoute = async ({ params, request }) => {
  const { actionName } = params;

  if (!actionName) {
    return new Response(
      JSON.stringify({ success: false, error: 'Action name is required' } as ActionResult),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data } = await request.json();

    const result = await executeAction(actionName, data);

    return new Response(
      JSON.stringify({ success: true, data: result } as ActionResult),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({ success: false, error: errorMessage } as ActionResult),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

async function executeAction(actionName: string, data: any): Promise<any> {
  const actions: Record<string, (data: any) => Promise<any>> = {
    'flip-resource': flipResourceAction,
    'update-config': updateConfigAction,
    'test-api-connection': testApiConnectionAction,
    'get-analytics': getAnalyticsAction,
    'save-resource-state': saveResourceStateAction,
  };

  const handler = actions[actionName];
  if (!handler) {
    throw new Error(`Unknown action: ${actionName}`);
  }

  return handler(data);
}

async function flipResourceAction(data: { resourceId: string; state: 'enabled' | 'disabled' }) {
  const { resourceId, state } = data;

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    resourceId,
    previousState: state === 'enabled' ? 'disabled' : 'enabled',
    newState: state,
    timestamp: new Date().toISOString(),
    message: `Resource ${resourceId} has been ${state}`,
  };
}

async function updateConfigAction(data: { configPath: string; value: any }) {
  const { configPath, value } = data;

  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    configPath,
    oldValue: 'previous-value',
    newValue: value,
    updatedAt: new Date().toISOString(),
    message: `Configuration ${configPath} updated successfully`,
  };
}

async function testApiConnectionAction(data: { endpoint?: string }) {
  const { endpoint = 'https://api.cloudflare.com' } = data;

  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    endpoint,
    status: 'connected',
    latency: Math.floor(Math.random() * 100) + 50,
    message: `Successfully connected to ${endpoint}`,
  };
}

async function getAnalyticsAction(data: { timeframe?: string }) {
  const { timeframe = '24h' } = data;

  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    timeframe,
    metrics: {
      requests: Math.floor(Math.random() * 100000) + 50000,
      errors: Math.floor(Math.random() * 1000),
      successRate: (99 + Math.random()).toFixed(2),
      avgLatency: Math.floor(Math.random() * 100) + 20,
      cacheHitRate: (80 + Math.random() * 15).toFixed(2),
    },
    timestamp: new Date().toISOString(),
  };
}

async function saveResourceStateAction(data: { resources: Array<{ id: string; state: string }> }) {
  const { resources } = data;

  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    saved: resources.length,
    resources: resources.map(r => ({ ...r, savedAt: new Date().toISOString() })),
    message: `${resources.length} resource(s) state saved successfully`,
  };
}
