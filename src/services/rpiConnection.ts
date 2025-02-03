import { EngineParameters } from '../types/engine';
import { formatJ1939Data } from '../types/j1939';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class RPiConnection {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private readonly url: string;
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const port = 8080;
    this.url = `${protocol}//${window.location.hostname}:${port}`;
  }

  onStatusChange(callback: (status: ConnectionStatus) => void) {
    this.statusListeners.push(callback);
    callback(this.getStatus());
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  private updateStatus(status: ConnectionStatus) {
    this.statusListeners.forEach(callback => callback(status));
  }

  getStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      default:
        return 'disconnected';
    }
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.updateStatus('connecting');
      console.log('Connecting to WebSocket server...');
      
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.updateStatus('connected');
        if (this.reconnectTimer) {
          clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.ws = null;
        this.updateStatus('disconnected');
        if (!this.reconnectTimer) {
          this.reconnectTimer = window.setInterval(() => {
            if (this.getStatus() !== 'connected') {
              this.connect();
            }
          }, 5000);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        this.updateStatus('error');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.updateStatus('error');
      if (!this.reconnectTimer) {
        this.reconnectTimer = window.setInterval(() => {
          if (this.getStatus() !== 'connected') {
            this.connect();
          }
        }, 5000);
      }
    }
  }

  sendData(parameters: EngineParameters) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      const messages = formatJ1939Data(parameters);
      
      for (const [pgn, data] of Object.entries(messages)) {
        const message = {
          pgn: Number(pgn),
          data: Array.from(data)
        };
        this.ws.send(JSON.stringify(message));
      }
      return true;
    } catch (error) {
      console.error('Error sending data:', error);
      return false;
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateStatus('disconnected');
  }
}

export const rpiConnection = new RPiConnection();