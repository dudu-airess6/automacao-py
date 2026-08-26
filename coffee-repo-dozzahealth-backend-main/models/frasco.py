from datetime import datetime
from decimal import Decimal


class Protocolo:
    pass


class Frasco:
    def __init__(
        self,
        id: int,
        volume_atual: Decimal,
        status: str,
        data_validade: datetime,
        localizacao_estoque: str = "",
        protocolo_id: int = None,
        protocolo: Protocolo = None
    ):
        self.id = id

        # Equivalente ao [Required]
        if volume_atual is None:
            raise ValueError("O volume atual do frasco é obrigatório.")
        self.volume_atual = round(volume_atual, 2)

        if not status:
            raise ValueError("O status do frasco é obrigatório.")
        self.status = status[:50]

        if data_validade is None:
            raise ValueError("A data de validade é obrigatória.")
        self.data_validade = data_validade

        self.localizacao_estoque = localizacao_estoque[:100]

        self.protocolo_id = protocolo_id
        self.protocolo = protocolo

    def get_quantidade_restante(self) -> Decimal:
        return self.volume_atual