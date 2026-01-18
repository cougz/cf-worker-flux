export interface ActionRequest {
  actionName: string;
  data: any;
}

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ComponentState {
  loading: boolean;
  error?: string;
  value?: any;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  state: 'enabled' | 'disabled';
  lastModified: string;
}

export interface Config {
  path: string;
  value: any;
  updatedAt: string;
}

export interface Analytics {
  timestamp: string;
  requests: number;
  errors: number;
  latency: number;
}
