from typing import Optional
from pydantic import BaseModel, Field # pyright: ignore[reportMissingImports]
from abc import ABC

class Usuario(BaseModel, ABC):
    id: Optional[int] = Field(default=None, description="Chave Primária")
    
    nome: str = Field(
        ..., 
        max_length=100, 
        description="O nome do usuário é obrigatório. Não pode exceder 100 caracteres."
    )
    
    login: str = Field(
        ..., 
        min_length=3,
        max_length=50, 
        description="O login deve ter entre 3 e 50 caracteres."
    )
    
    senha_hash: str = Field(
        ..., 
        min_length=8,
        max_length=255, 
        description="A senha deve ter no mínimo 8 caracteres."
    )

    def login_sistema(self) -> None:
        # Lógica de login
        pass

    def logout_sistema(self) -> None:
        # Lógica de logout
        pass