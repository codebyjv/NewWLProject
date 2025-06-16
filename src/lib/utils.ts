import React from 'react';
import type { ClassValue } from "clsx";
import { clsx as clsxOriginal } from "clsx";
import { twMerge } from "tailwind-merge";

//
/**
 * UTILITÁRIOS PARA PROJETOS REACT/NEXT.JS
 * Organizado por categorias
 */

// ==================== MANIPULAÇÃO DE CLASSES ====================
/**
 * Combina classes condicionalmente (Tailwind CSS friendly)
 * @example classNames('text-red-500', isActive && 'bg-blue-100')
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsxOriginal(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function classNames(...classes: Array<string | boolean | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Versão Type-Safe do classNames
 */
export function clsx(...args: Array<string | boolean | undefined | null>): string {
  return args.filter(Boolean).join(' ');
}

// ==================== FORMATAÇÃO DE DADOS ====================
/**
 * Formata valores monetários (R$)
 * @example formatCurrency(2500.99) → "R$ 2.500,99"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata datas (DD/MM/YYYY)
 * @example formatDate(new Date()) → "13/06/2024"
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata datas com hora (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
}

// ==================== MANIPULAÇÃO DE STRINGS ====================
/**
 * Encurta texto longo adicionando "..." no final
 * @example truncate("Texto muito longo", 10) → "Texto mui..."
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Remove acentos e caracteres especiais
 * @example normalizeText("Ação Érgonomica") → "Acao Ergonomica"
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// ==================== GERADORES DE URL ====================
/**
 * Cria URLs consistentes para a aplicação
 * @example createPageUrl("/products", { page: 2 }) → "/products?page=2"
 */
export function createPageUrl(
  pathname: string,
  params?: Record<string, string | number>
): string {
  const url = pathname.replace(/\/+/g, '/').replace(/\/$/, '');

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      query.append(key, String(value));
    });
    return `${url}?${query.toString()}`;
  }

  return url;
}

// ==================== VALIDAÇÕES ====================
/**
 * Valida e-mail com regex simples
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida CPF (apenas estrutura)
 */
export function isValidCPF(cpf: string): boolean {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
}

// ==================== MANIPULAÇÃO DE OBJETOS ====================
/**
 * Remove campos undefined/null de objetos
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  ) as Partial<T>;
}

/**
 * Merge de objetos com tipagem segura
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  return { ...target, ...source };
}

// ==================== HELPERS PARA REACT ====================
/**
 * Delay simulado para testes (async/await)
 * @example await delay(2000) → espera 2 segundos
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hook customizado para verificar montagem do componente
 * (Útil para evitar erros de hidratação no Next.js)
 */
export function useIsMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

// ==================== EXPORTAÇÃO ====================
export default {
  classNames,
  clsx,
  formatCurrency,
  formatDate,
  formatDateTime,
  truncate,
  normalizeText,
  createPageUrl,
  isValidEmail,
  isValidCPF,
  cleanObject,
  deepMerge,
  delay,
  useIsMounted
};