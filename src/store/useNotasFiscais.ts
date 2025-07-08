import { create } from "zustand";
import { NotaFiscal } from "@/types/nfe";

import { mockNotaFiscal } from "@/entities/notaFiscal";

interface NotasFiscaisStore {
  notas: NotaFiscal[];
  adicionarNota: (nota: NotaFiscal) => void;
  atualizarNota: (nota: NotaFiscal) => void;
  injetarMock: () => void;
}

export const useNotasFiscais = create<NotasFiscaisStore>((set) => ({
  notas: [],
  adicionarNota: (nota) =>
    set((state) => ({
      notas: [...state.notas, nota],
    })),
  atualizarNota: (notaAtualizada) =>
  set((state) => ({
    notas: state.notas.map((n) =>
      n.id === notaAtualizada.id ? notaAtualizada : n
    ),
  })),
  injetarMock: () =>
  set((state) => ({
    notas: [
      ...state.notas,
      {
        ...mockNotaFiscal,
        id: Date.now(), // ✅ ID único
        numero_nfe: String(Date.now()).slice(-6), // opcional: número diferente
      },
    ],
  })),
}));