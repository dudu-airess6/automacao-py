import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falhas devem ser menores que 1%
    http_req_duration: ['p(95)<500'], // 95% das requisições abaixo de 500ms
  },
};

export default function () {
  const url = 'http://127.0.0.1:8000/api/login';
  
  // ATENÇÃO: a API exige a chave "usuario" no JSON
  const payload = JSON.stringify({
    usuario: 'testuser',
    senha: 'secretpassword',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // Se o status não for 200, exibe a resposta no terminal para diagnóstico
  if (res.status !== 200) {
    console.log(`Erro Status: ${res.status} | Resposta: ${res.body}`);
  }

  check(res, {
    'status e 200': (r) => r.status === 200,
    'tempo de resposta aceitavel': (r) => r.timings.duration < 500,
  });

  sleep(1);
}