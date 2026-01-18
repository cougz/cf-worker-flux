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
    'get-cache-rule-status': getCacheRuleStatusAction,
    'toggle-cache-rule': toggleCacheRuleAction,
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

async function getCacheRuleStatusAction(data: {
  zoneId: string;
  rulesetId: string;
  ruleId: string;
  apiToken: string;
}): Promise<any> {
  const { zoneId, rulesetId, ruleId, apiToken } = data;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${rulesetId}/rules/${ruleId}`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || `API Error: ${response.status}`);
  }

  const result = await response.json();
  return {
    ruleId: result.result.id,
    enabled: result.result.enabled,
    description: result.result.description,
    lastUpdated: result.result.last_updated
  };
}

async function toggleCacheRuleAction(data: {
  zoneId: string;
  rulesetId: string;
  ruleId: string;
  enabled: boolean;
  apiToken: string;
}): Promise<any> {
  const { zoneId, rulesetId, ruleId, enabled, apiToken } = data;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${rulesetId}/rules/${ruleId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({ enabled })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || `API Error: ${response.status}`);
  }

  return await response.json();
}
