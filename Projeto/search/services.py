import csv
import os
from typing import List, Optional, Dict, Any

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "medicamentos_liquidos.csv")

class BuscaMedicamentosService:
    def __init__(self, csv_path: str = CSV_PATH):
        self.csv_path = csv_path
        self.medicamentos: List[dict] = []

    def carregar_dados(self):
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Dataset não encontrado no caminho: {self.csv_path}")

        self.medicamentos.clear()
        with open(self.csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if "id" in row and row["id"]:
                    row["id"] = int(row["id"])
                self.medicamentos.append(row)

        print(f">>> [DATASET] {len(self.medicamentos)} medicamentos líquidos carregados na memória!")

    def buscar(
        self, 
        q: Optional[str] = None, 
        forma: Optional[str] = None, 
        page: int = 1, 
        limit: int = 10
    ) -> Dict[str, Any]:
        resultados = self.medicamentos

        # Filtro por forma farmacêutica (ex: gotas, xarope, suspensão, solução)
        if forma:
            forma_clean = forma.strip().lower()
            resultados = [
                m for m in resultados
                if forma_clean in m.get("forma_farmaceutica", "").lower()
            ]

        # Filtro por termo (Nome Comercial, Princípio Ativo ou Instruções)
        if q:
            termo_clean = q.strip().lower()
            resultados = [
                m for m in resultados
                if termo_clean in m.get("nome_comercial", "").lower()
                or termo_clean in m.get("principio_ativo", "").lower()
                or termo_clean in m.get("instrucoes_prescricao", "").lower()
            ]

        # Lógica de Paginação
        total = len(resultados)
        inicio = (page - 1) * limit
        fim = inicio + limit
        resultados_paginados = resultados[inicio:fim]

        # Estrutura esperada pelo RespostaBuscaSchema
        return {
            "total_encontrados": total,
            "pagina": page,
            "limite": limit,
            "resultados": resultados_paginados
        }

busca_service = BuscaMedicamentosService()