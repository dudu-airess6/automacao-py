from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .services import busca_service
from .router import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Carrega o CSV na memória ao inicializar a aplicação
    busca_service.carregar_dados()
    yield

app = FastAPI(
    title="API de Busca de Prescrições Líquidas",
    description="Serviço de busca de alta performance para prescrições de medicamentos líquidos.",
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

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("search.main:app", host="127.0.0.1", port=8001, reload=True)