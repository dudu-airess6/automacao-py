import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 }, // Ramp-up: 10 usuários virtuais (VUs)
    { duration: '40s', target: 10 }, // Carga constante
    { duration: '20s', target: 30 }, // Estresse: pico repentino para 30 VUs
    { duration: '20s', target: 0 },  // Ramp-down: redução gradual
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],   // Falhas devem ser menores que 5%
    http_req_duration: ['p(95)<500'], // 95% das requisições devem responder em <500ms
  },
};

const BASE_URL = 'http://127.0.0.1:8000';

export default function () {
  const url = `${BASE_URL}/api/login`;
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

  check(res, {
    'status recebido': (r) => r.status === 200 || r.status === 401,
    'tempo de resposta aceitavel': (r) => r.timings.duration < 500,
  });

  sleep(1);
}