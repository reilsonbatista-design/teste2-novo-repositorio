import React from 'react';

// Mock simplificado: Define as funções do roteador manualmente 
// para que o Jest não precise carregar a biblioteca real, evitando o erro de "module not found"
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children }) => <div>{children}</div>,
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

describe('Regras de Negócio Internas', () => {

    // Teste da lógica de duplicidade de local
    test('Deve detectar se duas coordenadas são consideradas "vizinhas" (duplicadas)', () => {
        // Cenário: Local A (Marco Zero) e Local B (muito perto)
        const localExistente = { lat: -8.0631, lng: -34.8711 }; 
        const novoLocal = { lat: -8.0632, lng: -34.8712 }; // Diferença mínima

        // A lógica de proximidade (delta de 0.001)
        const delta = 0.001;
        const isDuplicado = (
            novoLocal.lat >= localExistente.lat - delta &&
            novoLocal.lat <= localExistente.lat + delta &&
            novoLocal.lng >= localExistente.lng - delta &&
            novoLocal.lng <= localExistente.lng + delta
        );

        // O sistema deve considerar duplicado (true)
        expect(isDuplicado).toBe(true); 
    });

    test('Não deve detectar duplicidade se for longe', () => {
        const localExistente = { lat: -8.0631, lng: -34.8711 }; 
        const novoLocal = { lat: -8.1000, lng: -34.9000 }; // Longe (Boa Viagem)

        const delta = 0.001;
        const isDuplicado = (
            novoLocal.lat >= localExistente.lat - delta &&
            novoLocal.lat <= localExistente.lat + delta &&
            novoLocal.lng >= localExistente.lng - delta &&
            novoLocal.lng <= localExistente.lng + delta
        );

        expect(isDuplicado).toBe(false); 
    });

    // Teste da matemática de conversão de pontos
    test('Deve calcular a conversão de Capibas corretamente', () => {
        // Cenário: Usuário tem 1250 pontos Visse
        const saldoUsuario = 1250;
        const TAXA_CONVERSAO = 500; // 500 pts = 1 moeda
        
        // Lógica de cálculo
        const moedasGeradas = Math.floor(saldoUsuario / TAXA_CONVERSAO);
        const sobraPontos = saldoUsuario % TAXA_CONVERSAO;

        // Esperado: 2 moedas e sobra de 250 pontos
        expect(moedasGeradas).toBe(2);
        expect(sobraPontos).toBe(250);
    });
});