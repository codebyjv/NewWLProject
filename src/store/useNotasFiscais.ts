import { create } from "zustand";
import { NotaFiscal } from "@/types/nfe";

interface NotasFiscaisStore {
  notas: NotaFiscal[];
  adicionarNota: (nota: NotaFiscal) => void;
  atualizarNota: (nota: NotaFiscal) => void;
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
}));