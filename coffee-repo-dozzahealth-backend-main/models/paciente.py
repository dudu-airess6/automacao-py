from typing import List, Optional
from decimal import Decimal
from models.medico import Prescricao
from pydantic import BaseModel, Field # pyright: ignore[reportMissingImports]

# Presumindo que a classe Prescricao exista em outro arquivo
# class Prescricao(BaseModel): ...

class Paciente(BaseModel):
    id: Optional[int] = Field(default=None, description="Chave Primária")
    
    nome: str = Field(
        ..., 
        max_length=150, 
        description="O nome do paciente é obrigatório. Não pode exceder 150 caracteres."
    )
    
    peso: Decimal = Field(
        ..., 
        max_digits=18, 
        decimal_places=2, 
        description="O peso do paciente é obrigatório."
    )
    
    prescricoes: List['Prescricao'] = Field(default_factory=list)