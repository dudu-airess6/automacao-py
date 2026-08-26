from fastapi import FastAPI
from pydantic import BaseModel, computed_field # pyright: ignore[reportMissingImports]
from datetime import date, timedelta
import random
import uvicorn

# Inicializa o builder da aplicação
# O FastAPI já configura o Swagger (OpenAPI) automaticamente e o expõe na rota /docs
app = FastAPI()

summaries = [
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", 
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
]

# Equivalente ao `record` do C# usando Pydantic
class WeatherForecast(BaseModel):
    date: date
    temperatureC: int
    summary: str | None = None

    # @computed_field garante que a propriedade calculada apareça no JSON de resposta
    @computed_field
    @property
    def temperatureF(self) -> int:
        return 32 + int(self.temperatureC / 0.5556)

# Equivalente ao app.MapGet
@app.get("/weatherforecast", name="GetWeatherForecast")
def get_weather_forecast() -> list[WeatherForecast]:
    hoje = date.today()
    
    # Equivalente ao Enumerable.Range(1, 5).Select(...)
    forecast = [
        WeatherForecast(
            date=hoje + timedelta(days=i),
            temperatureC=random.randint(-20, 55),
            summary=random.choice(summaries)
        )
        for i in range(1, 6)
    ]
    
    return forecast

# Equivalente ao app.Run()
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)