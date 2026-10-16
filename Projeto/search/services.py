import csv
import os
from typing import List, Optional

# Calcula o caminho dinâmico para encontrar a pasta 'data' na raiz do projeto
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
                row["id"] = int(row["id"])
                self.medicamentos.append(row)

        print(f">>> [DATASET] {len(self.medicamentos)} medicamentos líquidos carregados na memória!")

    def buscar(self, termo: Optional[str] = None, forma: Optional[str] = None) -> List[dict]:
        resultados = self.medicamentos

        # Filtro por forma farmacêutica (ex: gotas, xarope, suspensão, solução)
        if forma:
            forma_clean = forma.strip().lower()
            resultados = [
                m for m in resultados
                if forma_clean in m["forma_farmaceutica"].lower()
            ]

        # Filtro por termo (Nome Comercial, Princípio Ativo ou Instruções)
        if termo:
            termo_clean = termo.strip().lower()
            resultados = [
                m for m in resultados
                if termo_clean in m["nome_comercial"].lower()
                or termo_clean in m["principio_ativo"].lower()
                or termo_clean in m["instrucoes_prescricao"].lower()
            ]

        return resultados

busca_service = BuscaMedicamentosService()