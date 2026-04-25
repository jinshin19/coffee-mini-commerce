import http from 'k6/http';
import { check } from 'k6'

export const options = {
    vus: 10,
    duration: "10s"
};

export default function () {
    const response = http.get("http://localhost:8080/api/v1/products?page=1&limit=5&search=&filter=all");

    check(response, {
        'status is 200': (r) => r.status === 200
    })
}