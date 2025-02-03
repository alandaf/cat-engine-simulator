# CAT 3516B Engine Simulator - Instalación en Raspberry Pi

## Requisitos
- Raspberry Pi (3 o superior recomendado)
- Sistema operativo Raspberry Pi OS (anteriormente Raspbian)
- Node.js 18 o superior
- npm (viene con Node.js)

## Pasos de Instalación

1. Instalar Node.js en Raspberry Pi:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Clonar el proyecto:
```bash
git clone https://github.com/tu-usuario/cat-engine-simulator
cd cat-engine-simulator
```

3. Instalar dependencias:
```bash
npm install
```

4. Configurar el servidor para iniciar automáticamente:

Crear un servicio systemd:
```bash
sudo nano /etc/systemd/system/cat-engine.service
```

Contenido del archivo de servicio:
```ini
[Unit]
Description=CAT 3516B Engine Simulator
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/cat-engine-simulator
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

5. Habilitar e iniciar el servicio:
```bash
sudo systemctl enable cat-engine
sudo systemctl start cat-engine
```

## Acceso al Simulador

1. Interfaz Web:
   - Abrir un navegador en cualquier dispositivo de la red local
   - Acceder a: `http://[IP-DE-RASPBERRY]:5173`
   - Para la visualización de datos: `http://[IP-DE-RASPBERRY]:8080/visualizer.html`

2. Encontrar la IP de la Raspberry:
```bash
hostname -I
```

## Verificación

1. Verificar estado del servicio:
```bash
sudo systemctl status cat-engine
```

2. Ver logs en tiempo real:
```bash
journalctl -u cat-engine -f
```

## Solución de Problemas

1. Si el servicio no inicia:
   - Verificar logs: `journalctl -u cat-engine -n 50`
   - Verificar permisos: `ls -l /home/pi/cat-engine-simulator`
   - Verificar Node.js: `node --version`

2. Si no se puede acceder a la interfaz web:
   - Verificar firewall: `sudo ufw status`
   - Probar conexión: `curl localhost:5173`
   - Verificar red: `ifconfig`