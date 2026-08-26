from datetime import datetime
from decimal import Decimal
from typing import Optional
from models.farmaceutico import Farmaceutico
from models.frasco import Frasco
from models.medico import Prescricao
from sqlalchemy import String, Numeric, ForeignKey, func # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship # type: ignore

class Base(DeclarativeBase):
    pass

class OperacaoFracionamento(Base):
    __tablename__ = "operacoes_fracionamento"

    id: Mapped[int] = mapped_column(primary_key=True)

    prescricao_id: Mapped[int] = mapped_column(ForeignKey("prescricoes.id"), nullable=False)
    prescricao: Mapped["Prescricao"] = relationship()

    farmaceutico_id: Mapped[int] = mapped_column(ForeignKey("farmaceuticos.id"), nullable=False)
    farmaceutico: Mapped["Farmaceutico"] = relationship()

    frasco_original_id: Mapped[int] = mapped_column(ForeignKey("frascos.id"), nullable=False)
    frasco_original: Mapped["Frasco"] = relationship()

    volume_extraido: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)

    data_hora_inicio: Mapped[datetime] = mapped_column(default=func.now(), nullable=False)

    data_hora_fim: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    status: Mapped[str] = mapped_column(String(50), nullable=False)

    relatorio_detalhes: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    id_interno_mes: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)