from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uvicorn

from data.context import SessionLocal
from models.usuario import Usuario
from models.medico import Medico
from models.farmaceutico import Farmaceutico

app = FastAPI(title="DozzaHealth API")


# Dependency de sessão do banco - equivalente a injetar o
# ApplicationDbContext via [FromServices] / construtor no ASP.NET Core
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================================
# SCHEMAS (contrato da API - equivalente aos DTOs)
# ==========================================
class LoginRequest(BaseModel):
    usuario: str  # o app.js manda o campo "usuario" com o valor do login
    senha: str


class LoginResponse(BaseModel):
    mensagem: str
    usuario_id: int
    nome: str
    tipo_usuario: str


class CadastroRequest(BaseModel):
    nome: str
    login: str
    senha: str
    tipo_usuario: str  # "Medico" ou "Farmaceutico"

    # Campos específicos de Medico (opcionais aqui, obrigatórios se tipo_usuario == "Medico")
    crm: Optional[str] = None
    especialidade: Optional[str] = None

    # Campo específico de Farmaceutico
    crf: Optional[str] = None


class CadastroResponse(BaseModel):
    mensagem: str
    usuario_id: int


# ==========================================
# ROTAS
# ==========================================
@app.post("/api/login", response_model=LoginResponse, name="Login")
def login(dados: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.login == dados.usuario).first()

    # ATENÇÃO: comparação de senha em texto puro - ver observação abaixo
    # sobre hashing antes de ir para produção.
    if usuario is None or usuario.senha_hash != dados.senha:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    return LoginResponse(
        mensagem="Login realizado com sucesso.",
        usuario_id=usuario.id,
        nome=usuario.nome,
        tipo_usuario=usuario.tipo_usuario,
    )


@app.post("/api/cadastro", response_model=CadastroResponse, status_code=201, name="CadastrarUsuario")
def cadastro(dados: CadastroRequest, db: Session = Depends(get_db)):
    login_existente = db.query(Usuario).filter(Usuario.login == dados.login).first()
    if login_existente is not None:
        raise HTTPException(status_code=400, detail="Este login já está em uso.")

    if dados.tipo_usuario == "Medico":
        novo_usuario = Medico(
            nome=dados.nome,
            login=dados.login,
            senha_hash=dados.senha,  # ver observação sobre hashing
            crm=dados.crm,
            especialidade=dados.especialidade,
        )
    elif dados.tipo_usuario == "Farmaceutico":
        novo_usuario = Farmaceutico(
            nome=dados.nome,
            login=dados.login,
            senha_hash=dados.senha,  # ver observação sobre hashing
            crf=dados.crf,
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="tipo_usuario deve ser 'Medico' ou 'Farmaceutico'.",
        )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return CadastroResponse(
        mensagem="Usuário cadastrado com sucesso.",
        usuario_id=novo_usuario.id,
    )


# Equivalente ao app.Run()
if __name__ == "__main__":
    uvicorn.run("models.main:app", host="127.0.0.1", port=8000, reload=True)