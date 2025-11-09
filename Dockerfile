# Usa la imagen oficial de Bun como base
FROM oven/bun:1 AS base

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de definición de paquetes e instala dependencias
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa tu app (ej: 3000)
EXPOSE 3000

# Comando para iniciar tu aplicación con Bun
CMD [ "bun", "run", "--hot", "src/index.ts" ]
