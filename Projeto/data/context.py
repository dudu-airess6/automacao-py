from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from data.base import Base

# 1. Configura a string de conexão (equivalente à "ConnectionStrings" do appsettings.json)
#
# Formato: mssql+pyodbc://usuario:senha@servidor/NomeDoBanco?driver=ODBC+Driver+17+for+SQL+Server
#
# Exemplos:
#   - Servidor local com autenticação SQL:
#       DATABASE_URL = "mssql+pyodbc://sa:SuaSenha123@localhost/DozzaHealth?driver=ODBC+Driver+17+for+SQL+Server"
#
#   - Servidor local com Windows Authentication (sem usuário/senha):
#       DATABASE_URL = "mssql+pyodbc://localhost/DozzaHealth?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
#
#   - Instância nomeada (ex: SQL Server Express):
#       DATABASE_URL = "mssql+pyodbc://localhost\\SQLEXPRESS/DozzaHealth?driver=ODBC+Driver+17+for+SQL+Server"
#
# Troque os valores abaixo pelos do seu ambiente:
DATABASE_URL = (
    "mssql+pyodbc://USUARIO:SENHA@SERVIDOR/DozzaHealth"
    "?driver=ODBC+Driver+17+for+SQL+Server"
)

# 2. Cria a Engine (equivalente a registrar o DbContext com .UseSqlServer(...))
engine = create_engine(DATABASE_URL, echo=True)

# 3. Cria a fábrica de sessões (equivalente ao seu ApplicationDbContext)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Função auxiliar para criar as tabelas
# Equivalente ao database.EnsureCreated() (para dev/testes rápidos).
# Para produção, o ideal é usar Alembic (equivalente às Migrations do EF)
# em vez de criar as tabelas assim direto.
def criar_banco():
    Base.metadata.create_all(bind=engine)