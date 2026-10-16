from typing import List, Optional
from pydantic import BaseModel

class MedicamentoLiquido(BaseModel):
    id: int
    nome_comercial: str
    principio_ativo: str
    forma_farmaceutica: str
    concentracao: str
    dosagem_padrao: str
    instrucoes_prescricao: str

class ResultadoBuscaResponse(BaseModel):
    total_encontrados: int
    termo_buscado: Optional[str] = None
    forma_filtrada: Optional[str] = None
    resultados: List[MedicamentoLiquido]