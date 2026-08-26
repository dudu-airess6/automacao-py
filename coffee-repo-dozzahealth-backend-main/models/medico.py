from typing import List


class Usuario:
    def __init__(self, nome: str = ""):
        self.nome = nome


class Prescricao:
    pass


class Medico(Usuario):
    def __init__(
        self,
        nome: str = "",
        crm: str = "",
        especialidade: str = ""
    ):
        super().__init__(nome)

        # Equivalente ao [StringLength(20)]
        self.crm = crm[:20]

        # Equivalente ao [StringLength(100)]
        self.especialidade = especialidade[:100]

        self.prescricoes: List[Prescricao] = []

    def prescrever(self):
        # Lógica de prescrição
        pass