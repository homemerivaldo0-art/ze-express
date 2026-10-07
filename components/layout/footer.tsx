import { BadgeCheck, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <>
      {/* Seção Delivery */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Delivery — Bebida rápida onde você estiver
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Somos um delivery de bebidas com preços visíveis, informações claras de entrega e atendimento por e-mail em{' '}
            <a href="mailto:contato@expressbebidas.com" className="text-amber-600 font-semibold hover:underline">
              contato@expressbebidas.com
            </a>.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Venda de bebidas alcoólicas permitida somente para maiores de 18 anos.
          </p>
        </div>
      </section>

      {/* Seção Compre com transparência */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Compre com transparência</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm md:text-base">
              Informações claras sobre a empresa, entrega, pagamento e atendimento ao cliente.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <BadgeCheck className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Empresa registrada</h3>
              <p className="text-sm text-gray-600 leading-relaxed">EXPRESS BEBIDAS · CNPJ 14.380.200/0001-21</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <Truck className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Entrega na sua região</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O prazo de entrega varia conforme a região, disponibilidade e condições do pedido.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <CreditCard className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Pagamento transparente</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Preços exibidos no site. Pagamento via PIX e cartão de crédito.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Compra segura</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Site com conexão criptografada (HTTPS) e políticas de privacidade disponíveis.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-8">
            Venda de bebidas alcoólicas permitida somente para maiores de 18 anos. Beba com moderação.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1a1a1a] py-8 mt-0 pb-safe md:pb-8">
        <div className="container mx-auto px-4 pb-20 md:pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-3">EXPRESS BEBIDAS</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Delivery de bebidas com informações claras de preço, entrega e pagamento.
              </p>
              <p className="text-gray-400 text-sm mt-3">CNPJ 14.380.200/0001-21</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Atendimento</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-amber-400 transition-colors">Página de contato</Link>
                </li>
                <li>
                  <a href="mailto:contato@expressbebidas.com" className="hover:text-amber-400 transition-colors">
                    contato@expressbebidas.com
                  </a>
                </li>
                <li>O prazo de entrega varia conforme a região, disponibilidade e condições do pedido.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Informações legais</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Política de Privacidade</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Termos de Uso</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Trocas e Devoluções</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center md:text-left">
            <p className="text-gray-300 text-xs md:text-sm">© 2026 EXPRESS BEBIDAS — Todos os direitos reservados</p>
            <p className="text-gray-500 text-xs mt-2">
              Venda de bebidas alcoólicas proibida para menores de 18 anos. Beba com moderação.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
