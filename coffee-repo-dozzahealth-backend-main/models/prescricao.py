from datetime import datetime
from decimal import Decimal
from models.medico import Medico
from models.paciente import Paciente
from sqlalchemy import String, Numeric, ForeignKey, func # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship # pyright: ignore[reportMissingImports]

class Base(DeclarativeBase):
    pass

class Prescricao(Base):
    __tablename__ = "prescricoes"

    id: Mapped[int] = mapped_column(primary_key=True)

    dosagem: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)

    paciente_id: Mapped[int] = mapped_column(ForeignKey("pacientes.id"), nullable=False)
    # Adicionado back_populates caso você queira vincular a lista criada no modelo Paciente
    paciente: Mapped["Paciente"] = relationship(back_populates="prescricoes")

    medico_id: Mapped[int] = mapped_column(ForeignKey("medicos.id"), nullable=False)
    medico: Mapped["Medico"] = relationship()

    medicamento_nome: Mapped[str] = mapped_column(String(150), nullable=False)

    data_prescricao: Mapped[datetime] = mapped_column(default=func.now(), nullable=False)

    status: Mapped[str] = mapped_column(String(50), default="Pendente", nullable=False)