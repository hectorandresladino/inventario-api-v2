# Plataforma Full Stack de Gestión de Pedidos

Sistema completo de gestión de pedidos con arquitectura fullstack.

## Tecnologías

### Frontend
- React 18
- Vite
- TypeScript
- TailwindCSS
- Axios
- Lucide React (iconos)

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL

## Estructura del Proyecto

```
Plataforma Full Stack de Gestión de Pedidos/
├── frontend/                 # Aplicación React + Vite + TypeScript
│   ├── src/
│   │   ├── App.tsx          # Componente principal
│   │   ├── main.tsx         # Punto de entrada
│   │   └── index.css        # Estilos globales
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                  # Aplicación Spring Boot
│   ├── src/main/java/com/gestionpedidos/
│   │   ├── GestionPedidosApplication.java
│   │   ├── model/           # Entidades JPA
│   │   ├── repository/      # Repositorios Spring Data
│   │   ├── service/         # Lógica de negocio
│   │   └── controller/      # Controladores REST
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── database/
    └── init.sql             # Script de inicialización de BD
```

## Requisitos Previos

- **Node.js** (v18 o superior)
- **Java 17** o superior
- **Maven** 3.6+
- **PostgreSQL** 13+

## Configuración de la Base de Datos

1. **Instalar PostgreSQL** si no lo tienes:
   - Windows: Descargar desde https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Ejecutar los scripts de inicialización**:
   
   Primero crear la base de datos:
   ```bash
   psql -U postgres -f database/create_database.sql
   ```
   
   Luego crear las tablas e insertar datos de ejemplo:
   ```bash
   psql -U postgres -d gestion_pedidos -f database/create_tables.sql
   ```

3. **Configurar credenciales** (si son diferentes):
   - Editar `backend/src/main/resources/application.properties`
   - Modificar `spring.datasource.username` y `spring.datasource.password`

## Instalación y Ejecución

### Backend (Spring Boot)

1. **Navegar al directorio del backend**:
   ```bash
   cd backend
   ```

2. **Compilar y ejecutar**:
   ```bash
   mvn spring-boot:run
   ```
   
   O compilar primero:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Verificar que el backend está funcionando**:
   - Abrir http://localhost:8080/pedidos en el navegador
   - Deberías ver un JSON con los pedidos

### Frontend (React + Vite)

1. **Navegar al directorio del frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir la aplicación**:
   - El navegador se abrirá automáticamente en http://localhost:5173
   - O abrir manualmente: http://localhost:5173

## Funcionalidades

### Gestión de Pedidos
- **Crear** nuevos pedidos con cliente, producto, cantidad, precio, estado y fecha
- **Editar** pedidos existentes
- **Eliminar** pedidos
- **Buscar** pedidos por cliente o producto
- **Filtrar** por estado (Pendiente, En Proceso, Completado, Cancelado)

### Dashboard
- Visualización de estadísticas en tiempo real
- Total de pedidos
- Ventas totales
- Pedidos pendientes

## API REST Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Obtener todos los pedidos |
| GET | `/api/pedidos/{id}` | Obtener un pedido por ID |
| POST | `/api/pedidos` | Crear un nuevo pedido |
| PUT | `/api/pedidos/{id}` | Actualizar un pedido existente |
| DELETE | `/api/pedidos/{id}` | Eliminar un pedido |

## Modelo de Datos

### Pedido
```json
{
  "id": 1,
  "cliente": "Juan Pérez",
  "producto": "Laptop HP",
  "cantidad": 1,
  "precio": 899.99,
  "estado": "PENDIENTE",
  "fecha": "2024-01-15"
}
```

### Estados de Pedido
- `PENDIENTE`: Pedido creado pero no procesado
- `EN_PROCESO`: Pedido siendo procesado
- `COMPLETADO`: Pedido completado exitosamente
- `CANCELADO`: Pedido cancelado

## Solución de Problemas

### Backend no se conecta a la base de datos
- Verificar que PostgreSQL esté ejecutándose
- Verificar las credenciales en `application.properties`
- Verificar que la base de datos `gestion_pedidos` exista

### Frontend no se conecta al backend
- Verificar que el backend esté ejecutándose en el puerto 8080
- Verificar la configuración del proxy en `vite.config.ts`

### Errores de CORS
- El controlador ya tiene `@CrossOrigin(origins = "*")`
- Si persiste, verificar configuración de seguridad del navegador

## Despliegue en OpenShift

Para desplegar el backend en OpenShift, usa el `Dockerfile` del directorio `backend/` y los manifiestos `backend/openshift-postgres.yaml` y `backend/openshift-resources.yaml`.

1. Construye la imagen Docker localmente o con el builder de OpenShift:
   ```bash
   cd backend
   docker build -t gestion-pedidos-backend:latest .
   ```

2. Sube la imagen a un registro accesible por OpenShift, por ejemplo `quay.io` o `docker.io`.

3. Actualiza `backend/openshift-resources.yaml` en la sección `Deployment` con la imagen correcta:
   ```yaml
   image: <REGISTRY>/<USER>/gestion-pedidos-backend:latest
   ```

4. Primero aplica el servicio de PostgreSQL con `backend/openshift-postgres.yaml` y luego el backend con `backend/openshift-resources.yaml`.
   - Si usas el manifiesto propuesto, la URL de conexión será `jdbc:postgresql://gestion-pedidos-postgres:5432/gestion_pedidos`.
   - Las credenciales se leen desde el secreto `gestion-pedidos-postgres-secret`.
   - Si deseas usar otra base de datos externa, ajusta `SPRING_DATASOURCE_URL` y las referencias de secreto en `backend/openshift-resources.yaml`.

5. Aplica primero la base de datos y después el backend:
   ```bash
   oc apply -f backend/openshift-postgres.yaml
   oc apply -f backend/openshift-resources.yaml
   ```

6. Verifica la ruta generada por OpenShift y accede a la API.

## Desarrollo

### Preparar el repositorio antes de subir a GitHub

- **No subir secretos**: no incluyas credenciales en los manifiestos. Usa `backend/openshift-postgres.template.yaml` como referencia y crea el `Secret` en OpenShift con `oc create secret generic ...`.
- **Generar Maven Wrapper localmente** (recomendado para reproducibilidad): desde la carpeta `backend` ejecuta:

```bash
# genera mvnw y la carpeta .mvn/wrapper
mvn -N io.takari:maven:wrapper:wrapper
# o, si tu entorno prefiere el plugin oficial:
mvn -N org.apache.maven.plugins:maven-wrapper:3.1.1:wrapper
```

- **Ignorar artefactos de build**: ya están en `.gitignore` `backend/target` y `frontend/dist` para evitar subir jars y bundles al repo.


### Compilar para producción

**Frontend**:
```bash
cd frontend
npm run build
```

**Backend**:
```bash
cd backend
mvn clean package
java -jar target/gestion-pedidos-backend-0.0.1-SNAPSHOT.jar
```

## Licencia

Este proyecto es para fines educativos.
