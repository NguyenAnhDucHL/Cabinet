# Stage 1: Base - Cài đặt các công cụ hệ thống cần thiết (Dùng chung cho cả Dev và Prod)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS base
WORKDIR /app

# Install native dependencies for PaddleOCR and SkiaSharp
RUN sed -i 's|http://ports.ubuntu.com/ubuntu-ports/|https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/|g' /etc/apt/sources.list.d/ubuntu.sources || true
RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -y \
    libgdiplus \
    libc6-dev \
    libgomp1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*


# Stage 2: Frontend Build
FROM node:22-alpine AS client-build
WORKDIR /src/Cabinet.Api/ClientApp
COPY ["Cabinet.Api/ClientApp/package.json", "Cabinet.Api/ClientApp/package-lock.json", "./"]
RUN npm config set registry https://registry.npmmirror.com && npm install --legacy-peer-deps
COPY ["Cabinet.Api/ClientApp/", "./"]
COPY ["Cabinet.Api/wwwroot/", "../wwwroot/"]
RUN npm run build

# Stage 3: Build
FROM base AS build
WORKDIR /src
COPY ["Cabinet.Api/Cabinet.Api.csproj", "Cabinet.Api/"]
COPY ["Cabinet.Core/Cabinet.Core.csproj", "Cabinet.Core/"]
RUN dotnet restore "Cabinet.Api/Cabinet.Api.csproj" --disable-parallel
COPY . .
COPY --from=client-build /src/Cabinet.Api/wwwroot ./Cabinet.Api/wwwroot
WORKDIR "/src/Cabinet.Api"
RUN dotnet build "Cabinet.Api.csproj" -c Release -o /app/build

# Stage 4: Publish
FROM build AS publish
RUN dotnet publish "Cabinet.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 5: Final Runtime (Sử dụng aspnet để tối ưu dung lượng khi chạy thật)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
# Phải cài lại dependencies vì aspnet image khác với sdk image
RUN sed -i 's|http://ports.ubuntu.com/ubuntu-ports/|https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/|g' /etc/apt/sources.list.d/ubuntu.sources || true
RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -y \
    libgdiplus \
    libc6-dev \
    libgomp1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*
COPY --from=publish /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Cabinet.Api.dll"]
