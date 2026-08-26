from typing import List


class Usuario:
    def __init__(self, nome: str = ""):
        self.nome = nome


class Protocolo:
    pass


class OperacaoFracionamento:
    pass


class Farmaceutico(Usuario):
    def __init__(self, nome: str = "", crf: str = ""):
        super().__init__(nome)

        # Equivalente ao [StringLength(20)]
        self.crf = crf[:20]

        self.protocolos_gerenciados: List[Protocolo] = []
        self.operacoes_aprovadas: List[OperacaoFracionamento] = []

    def selecionar_protocolo(self):
        # Lógica para selecionar protocolo
        pass

    def iniciar_fracionamento(self):
        # Lógica para iniciar fracionamento
        pass