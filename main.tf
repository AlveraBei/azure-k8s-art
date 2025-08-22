# 使用 Azure 提供者
provider "azurerm" {
  features {}
}

# 创建 Azure 资源组
resource "azurerm_resource_group" "rg" {
  name     = "art-portfolio-rg"
  location = "East US"
}

# 创建 Azure Container Registry (ACR)
resource "azurerm_container_registry" "acr" {
  name                = "myazureacrname" # 替换为你的 ACR 名称
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = false
}

# 创建 Azure Kubernetes Service (AKS)
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "tech-art-portfolio"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "tech-art-portfolio"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}

# 创建 Azure Key Vault
resource "azurerm_key_vault" "kv" {
  name                = "tech-portfolio-kv"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  soft_delete_retention_days = 7
}

# 获取当前 Azure 客户端的配置
data "azurerm_client_config" "current" {}

# 创建 Azure Database for PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "db" {
  name                = "art-portfolio-db"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  version             = "14"
  sku_name            = "Standard_B1ms"
  administrator_login = "pgadmin"
  administrator_password = "My-Super-Secret-Password-123!"
  storage_mb           = 32768
  backup_retention_days = 7
  geo_redundant_backup_enabled = false
  zone                = "1"
  delegated_subnet_id = "" # 这里不需要，因为我们没有使用 VNet
}

# 在 Key Vault 中存储数据库连接字符串
resource "azurerm_key_vault_secret" "db_connection_string" {
  name         = "db-connection-string"
  value        = "Host=${azurerm_postgresql_flexible_server.db.fqdn} Port=5432 Database=postgres Username=${azurerm_postgresql_flexible_server.db.administrator_login} Password=${azurerm_postgresql_flexible_server.db.administrator_password} Ssl Mode=Require"
  key_vault_id = azurerm_key_vault.kv.id
}