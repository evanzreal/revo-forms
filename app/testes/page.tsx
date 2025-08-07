import { TestSuite } from "@/components/test-suite"
import { SystemMonitor } from "@/components/system-monitor"
import { CountdownTimer } from "@/components/countdown-timer"
import Image from "next/image"

export default function TestesPage() {
  return (
    <div className="min-h-screen relative px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Background Images - Responsivo */}
      <div className="absolute inset-0 z-0">
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-desktop.png')",
          }}
        />
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-mobile.png')",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center mb-2 sm:mb-4">
            <Image
              src="/images/logo-rafa-academy.png"
              alt="RAFA ACADEMY"
              width={120}
              height={60}
              className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 object-contain"
              priority
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            🧪 CENTRO DE TESTES - SISTEMA DE&nbsp;RENOVAÇÃO
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">
            Bateria completa de testes para garantir funcionamento&nbsp;perfeito
          </p>
        </div>

        {/* Monitor em Tempo Real */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <SystemMonitor />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Testes Automatizados */}
          <TestSuite />
        </div>

        {/* Teste Manual do Cronômetro */}
        <div className="p-3 sm:p-4 md:p-6 bg-gray-900 text-white rounded-lg">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">⏰ Teste do&nbsp;Cronômetro</h2>
          <CountdownTimer />
          <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-4">
            ✅ Cronômetro deve atualizar a cada&nbsp;segundo
          </p>
        </div>

        {/* Checklist Manual */}
        <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-gray-900 text-white rounded-lg">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">
            📋 Checklist de&nbsp;Funcionalidades
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div>
              <h3 className="font-bold mb-1 sm:mb-2 text-cyan-400 text-sm sm:text-base">🏠 Página&nbsp;Inicial</h3>
              <ul className="text-xs sm:text-sm space-y-0.5 sm:space-y-1 text-gray-300">
                <li>□ Cronômetro funcionando</li>
                <li>□ Logo RAFA ACADEMY</li>
                <li>□ Campo email funcional</li>
                <li>□ Botão "Descobrir oferta"</li>
                <li>□ Validação de email</li>
                <li>□ Envio para webhook</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1 sm:mb-2 text-green-400 text-sm sm:text-base">🎁 Página&nbsp;Oferta</h3>
              <ul className="text-xs sm:text-sm space-y-0.5 sm:space-y-1 text-gray-300">
                <li>□ Cronômetro funcionando</li>
                <li>□ 6 cards de benefícios</li>
                <li>□ Valor da oferta</li>
                <li>□ Botão atendimento</li>
                <li>□ Valor do webhook usado</li>
                <li>□ Redirecionamento correto</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1 sm:mb-2 text-red-400 text-sm sm:text-base">❌ Não&nbsp;Encontrado</h3>
              <ul className="text-xs sm:text-sm space-y-0.5 sm:space-y-1 text-gray-300">
                <li>□ Mensagem clara</li>
                <li>□ Botão atendimento</li>
                <li>□ Botão testar email</li>
                <li>□ Links WhatsApp</li>
                <li>□ Volta para início</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1 sm:mb-2 text-purple-400 text-sm sm:text-base">🔧 Sistema</h3>
              <ul className="text-xs sm:text-sm space-y-0.5 sm:space-y-1 text-gray-300">
                <li>□ API funcionando</li>
                <li>□ Webhook respondendo</li>
                <li>□ API key enviada</li>
                <li>□ Tratamento de erros</li>
                <li>□ Logs funcionais</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cenários de Teste */}
        <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-gray-900 text-white rounded-lg">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">🎯 Cenários de&nbsp;Teste</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h3 className="font-bold mb-1 sm:mb-2 text-green-400 text-sm sm:text-base">
                ✅ Cenários de&nbsp;Sucesso
              </h3>
              <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2 text-gray-300">
                <li>• Email encontrado → Redireciona para /oferta com&nbsp;valor</li>
                <li>• Valor exibido → Mostra valor do&nbsp;webhook</li>
                <li>• Botão atendimento → Abre&nbsp;WhatsApp</li>
                <li>• Cronômetro → Atualiza&nbsp;continuamente</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-1 sm:mb-2 text-red-400 text-sm sm:text-base">❌ Cenários de&nbsp;Erro</h3>
              <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2 text-gray-300">
                <li>• Email não encontrado → Redireciona para&nbsp;/nao-encontrado</li>
                <li>• Webhook offline → Mostra erro&nbsp;apropriado</li>
                <li>• Email inválido → Mostra&nbsp;validação</li>
                <li>• Sem valor → Usa&nbsp;fallback</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links de Teste Rápido */}
        <div className="p-3 sm:p-4 md:p-6 bg-gray-900 text-white rounded-lg">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">🔗 Navegação de&nbsp;Teste</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <a
              href="/"
              className="block p-2 sm:p-3 md:p-4 bg-blue-600 hover:bg-blue-700 rounded text-center transition-colors text-xs sm:text-sm"
            >
              🏠 Página&nbsp;Inicial
            </a>
            <a
              href="/oferta?valor=R%24714%2C59"
              className="block p-2 sm:p-3 md:p-4 bg-green-600 hover:bg-green-700 rounded text-center transition-colors text-xs sm:text-sm"
            >
              🎁 Oferta (com&nbsp;valor)
            </a>
            <a
              href="/oferta"
              className="block p-2 sm:p-3 md:p-4 bg-yellow-600 hover:bg-yellow-700 rounded text-center transition-colors text-xs sm:text-sm"
            >
              🎁 Oferta (sem&nbsp;valor)
            </a>
            <a
              href="/nao-encontrado"
              className="block p-2 sm:p-3 md:p-4 bg-red-600 hover:bg-red-700 rounded text-center transition-colors text-xs sm:text-sm"
            >
              ❌ Não&nbsp;Encontrado
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
