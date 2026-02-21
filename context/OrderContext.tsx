"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Upsells {
    guirlanda: boolean;
    ledQuantidade: number; // 0, 1, or 2
    mesa: boolean;
}

interface Servicos {
    selfService: boolean;
    entrega: boolean;
    montagem: boolean;
    retirada: boolean;
    comodidadeTotal: boolean;
}

interface Valores {
    valorPlano: number;
    valorUpsells: number;
    valorServicos: number;
    desconto: number;
    total: number;
}

interface OrderState {
    nomeCliente?: string;
    tipoEvento: string;
    tema: string;
    data: string;
    local: string;
    planoSelecionado: string;
    upsells: Upsells;
    servicos: Servicos;
    formaPagamento: "50/50" | "100" | "";
    valores: Valores;
}

interface OrderContextType {
    state: OrderState;
    setNomeCliente: (nome: string) => void;
    setTipoEvento: (tipo: string) => void;
    setTema: (tema: string) => void;
    setData: (data: string) => void;
    setLocal: (local: string) => void;
    setPlanoSelecionado: (plano: string, valor: number) => void;
    updateUpsells: (upsells: Partial<Upsells>) => void;
    updateServicos: (servicos: Partial<Servicos>) => void;
    setFormaPagamento: (forma: "50/50" | "100") => void;
    resetOrder: () => void;
}

const initialState: OrderState = {
    nomeCliente: "",
    tipoEvento: "",
    tema: "",
    data: "",
    local: "",
    planoSelecionado: "",
    upsells: {
        guirlanda: false,
        ledQuantidade: 0,
        mesa: false,
    },
    servicos: {
        selfService: false,
        entrega: false,
        montagem: false,
        retirada: false,
        comodidadeTotal: false,
    },
    formaPagamento: "",
    valores: {
        valorPlano: 0,
        valorUpsells: 0,
        valorServicos: 0,
        desconto: 0,
        total: 0,
    },
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<OrderState>(initialState);

    // Constants
    const VALORES_UPSELLS = {
        guirlanda: 40,
        led: 35, // per unit
        mesa: 30,
    };

    const VALORES_SERVICOS = {
        entrega: 40,
        montagem: 40,
        retirada: 40,
        comodidadeTotal: 120,
    };

    useEffect(() => {
        // Recalculate values whenever state changes
        let valorUpsells = 0;
        if (state.upsells.guirlanda) valorUpsells += VALORES_UPSELLS.guirlanda;
        valorUpsells += state.upsells.ledQuantidade * VALORES_UPSELLS.led;
        if (state.upsells.mesa) valorUpsells += VALORES_UPSELLS.mesa;

        let valorServicos = 0;
        if (state.servicos.comodidadeTotal) {
            valorServicos = VALORES_SERVICOS.comodidadeTotal;
        } else {
            if (state.servicos.entrega) valorServicos += VALORES_SERVICOS.entrega;
            if (state.servicos.montagem) valorServicos += VALORES_SERVICOS.montagem;
            if (state.servicos.retirada) valorServicos += VALORES_SERVICOS.retirada;
        }

        const total = state.valores.valorPlano + valorUpsells + valorServicos;

        setState((prev) => ({
            ...prev,
            valores: {
                ...prev.valores,
                valorUpsells,
                valorServicos,
                total,
            },
        }));
    }, [state.upsells, state.servicos, state.valores.valorPlano, state.formaPagamento]);

    const setNomeCliente = (nomeCliente: string) => setState((prev) => ({ ...prev, nomeCliente }));
    const setTipoEvento = (tipoEvento: string) => setState((prev) => ({ ...prev, tipoEvento }));
    const setTema = (tema: string) => setState((prev) => ({ ...prev, tema }));
    const setData = (data: string) => setState((prev) => ({ ...prev, data }));
    const setLocal = (local: string) => setState((prev) => ({ ...prev, local }));

    const setPlanoSelecionado = (planoSelecionado: string, valorPlano: number) =>
        setState((prev) => ({
            ...prev,
            planoSelecionado,
            valores: { ...prev.valores, valorPlano }
        }));

    const updateUpsells = (upsells: Partial<Upsells>) =>
        setState((prev) => ({
            ...prev,
            upsells: { ...prev.upsells, ...upsells },
        }));

    const updateServicos = (servicos: Partial<Servicos>) => {
        setState((prev) => {
            let newServicos = { ...prev.servicos, ...servicos };

            // If comodidadeTotal is selected, uncheck others
            if (servicos.comodidadeTotal === true) {
                newServicos.entrega = false;
                newServicos.montagem = false;
                newServicos.retirada = false;
            } else if (servicos.entrega || servicos.montagem || servicos.retirada) {
                // If any specific service is selected, uncheck comodidadeTotal
                newServicos.comodidadeTotal = false;
            }

            return { ...prev, servicos: newServicos };
        });
    };

    const setFormaPagamento = (formaPagamento: "50/50" | "100") =>
        setState((prev) => ({ ...prev, formaPagamento }));

    const resetOrder = () => setState(initialState);

    return (
        <OrderContext.Provider
            value={{
                state,
                setNomeCliente,
                setTipoEvento,
                setTema,
                setData,
                setLocal,
                setPlanoSelecionado,
                updateUpsells,
                updateServicos,
                setFormaPagamento,
                resetOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};
