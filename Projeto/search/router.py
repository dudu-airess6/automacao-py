from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from .schemas import ResultadoBuscaResponse
from .services import busca_service

router = APIRouter(prefix="/api/v1", tags=["Busca de Prescrições"])

@router.get("/buscar", response_model=ResultadoBuscaResponse, summary="Buscar prescrições de remédios líquidos")
def buscar_medicamentos(
    q: Optional[str] = Query(None, description="Termo para busca por Nome Comercial ou Princípio Ativo (Ex: Dipirona)"),
    forma: Optional[str] = Query(None, description="Filtrar por forma farmacêutica (Ex: Gotas, Xarope, Suspensão, Solução)")
):
    try:
        resultados = busca_service.buscar(termo=q, forma=forma)
        return ResultadoBuscaResponse(
            total_encontrados=len(resultados),
            termo_buscado=q,
            forma_filtrada=forma,
            resultados=resultados
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno na busca: {str(e)}")