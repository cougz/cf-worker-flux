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

export class StateManager {
  private state: Map<string, any>;
  private loadingStates: Set<string>;
  private subscribers: Map<string, Set<(value: any) => void>>;
  private components: Map<string, Set<string>>;

  constructor() {
    this.state = new Map();
    this.loadingStates = new Set();
    this.subscribers = new Map();
    this.components = new Map();
  }

  public get(key: string): any {
    return this.state.get(key);
  }

  public set(key: string, value: any): void {
    this.state.set(key, value);
    this.notifySubscribers(key);
  }

  public update(key: string, updater: (current: any) => any): void {
    const current = this.get(key);
    const updated = updater(current);
    this.set(key, updated);
  }

  public subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  public async executeAction(actionName: string, data: any = {}): Promise<ActionResult> {
    this.setLoading(actionName, true);

    try {
      const response = await fetch(`/firewall-for-ai/api/actions/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json() as ActionResult;

      if (result.success) {
        this.set(`${actionName}_result`, result.data);
      } else {
        this.set(`${actionName}_error`, result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.set(`${actionName}_error`, errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      this.setLoading(actionName, false);
    }
  }

  public setLoading(key: string, loading: boolean): void {
    if (loading) {
      this.loadingStates.add(key);
    } else {
      this.loadingStates.delete(key);
    }
    this.notifySubscribers(`${key}_loading`);
  }

  public isLoading(key: string): boolean {
    return this.loadingStates.has(key);
  }

  public registerComponent(id: string, stateKeys: string[]): void {
    if (!this.components.has(id)) {
      this.components.set(id, new Set());
    }
    stateKeys.forEach(key => this.components.get(id)!.add(key));
  }

  public getComponentState(id: string): Map<string, any> {
    const keys = this.components.get(id);
    if (!keys) return new Map();

    const componentState = new Map<string, any>();
    keys.forEach(key => {
      componentState.set(key, this.get(key));
      if (key.endsWith('_result')) {
        const actionKey = key.replace('_result', '');
        componentState.set(`${actionKey}_loading`, this.isLoading(actionKey));
      }
      if (key.endsWith('_error')) {
        const actionKey = key.replace('_error', '');
        componentState.set(`${actionKey}_loading`, this.isLoading(actionKey));
      }
    });

    return componentState;
  }

  private notifySubscribers(key: string): void {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      const value = this.get(key);
      callbacks.forEach(callback => callback(value));
    }

    const loadingKey = `${key}_loading`;
    const loadingCallbacks = this.subscribers.get(loadingKey);
    if (loadingCallbacks) {
      loadingCallbacks.forEach(callback => callback(this.isLoading(key)));
    }
  }

  public clear(): void {
    this.state.clear();
    this.loadingStates.clear();
    this.subscribers.forEach(callbacks => callbacks.clear());
  }

  public has(key: string): boolean {
    return this.state.has(key);
  }

  public delete(key: string): boolean {
    const deleted = this.state.delete(key);
    this.loadingStates.delete(key);
    this.notifySubscribers(key);
    return deleted;
  }
}

const stateManager = new StateManager();

if (typeof window !== 'undefined') {
  (window as any).__stateManager = stateManager;
}

export default stateManager;
