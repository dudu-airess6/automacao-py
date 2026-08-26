from typing import List, Optional
from decimal import Decimal
from models.farmaceutico import Farmaceutico
from models.frasco import Frasco
from pydantic import BaseModel, Field # pyright: ignore[reportMissingImports]

# Presumindo que estas classes existam em outros arquivos
# class Farmaceutico(BaseModel): ...
# class Frasco(BaseModel): ...

class Protocolo(BaseModel):
    id: Optional[int] = Field(default=None, description="Chave Primária")
    
    medicamento: str = Field(
        ..., 
        max_length=150, 
        description="O nome do medicamento é obrigatório. Não pode exceder 150 caracteres."
    )
    
    composicao: str = Field(
        ..., 
        max_length=500, 
        description="A composição é obrigatória. Não pode exceder 500 caracteres."
    )
    
    area_secao_transversal: Decimal = Field(
        ..., 
        max_digits=18, 
        decimal_places=2, 
        description="A área de seção transversal é obrigatória."
    )
    
    quantidade_total: Decimal = Field(
        ..., 
        max_digits=18, 
        decimal_places=2, 
        description="A quantidade total do frasco é obrigatória."
    )
    
    # O C# trata `decimal` como tipo de valor (não-nulo por padrão)
    viscosidade: Decimal = Field(..., max_digits=18, decimal_places=2)
    
    # Sem a tag [Required] no C#, a string pode ser nula
    tipo_valvula: Optional[str] = Field(default=None, max_length=50)
    
    taxa_gotejamento_padrao: Decimal = Field(..., max_digits=18, decimal_places=2)
    
    # int? no C# significa que pode ser nulo
    farmaceutico_id: Optional[int] = None
    farmaceutico: Optional['Farmaceutico'] = None
    
    frascos: List['Frasco'] = Field(default_factory=list)