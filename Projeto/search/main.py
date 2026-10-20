from contextlib import asynccontextmanager
import importlib
import pkgutil
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from data.base import Base
from data.context import SessionLocal, engine
import models
from models.farmaceutico import Farmaceutico
from models.usuario import Usuario

from .services import busca_service
from .router import router as busca_router
from models.router import router as auth_router

# Importa módulos dinamicamente para resolver mappers do SQLAlchemy
for _, module_name, _ in pkgutil.iter_modules(models.__path__):
    if module_name != "main":
        importlib.import_module(f"models.{module_name}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Criação de tabelas e Seeding do usuário k6 no Banco de Dados
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        test_user = db.query(Usuario).filter(Usuario.login == "testuser").first()
        if not test_user:
            novo_teste = Farmaceutico(
                nome="Usuario Teste k6",
                login="testuser",
                senha_hash="secretpassword",
                crf="12345"
            )
            db.add(novo_teste)
            db.commit()
            print(">>> [SUCESSO] Usuario 'testuser' pronto para testes do k6!")
        else:
            print(">>> [SUCESSO] Usuario 'testuser' já existe no BD e está pronto!")
    except Exception as e:
        print(f">>> [ERRO NO STARTUP BD]: {e}")
        db.rollback()
    finally:
        db.close()

    # 2. Carrega o CSV na memória para o serviço de busca
    busca_service.carregar_dados()
    yield

app = FastAPI(
    title="DozzaHealth - API Unificada (Autenticação e Busca)",
    description="Serviço de alta performance para gestão de usuários, farmacêuticos e busca de prescrições de medicamentos líquidos.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(busca_router)

if __name__ == "__main__":
    uvicorn.run("search.main:app", host="127.0.0.1", port=8001, reload=True)