import { useSettings } from '@/api/queries';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function Terms() {
  const { data: settings } = useSettings();
  const brandName = settings?.brandName ?? 'RibeiraZul';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Termos e Condições de Utilização</h1>
        
        <div className="prose max-w-none text-gray-700 space-y-6">
          <p className="lead text-lg text-gray-600">
            Bem-vindo ao website da {brandName}. Ao aceder e utilizar este site, o utilizador concorda em cumprir os presentes Termos e Condições, que regem a relação entre a {brandName} (Licença AMI 26172) e o utilizador.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder a este website, o utilizador declara ter lido, compreendido e aceite os Termos e Condições aqui descritos, bem como todas as leis e regulamentos aplicáveis. Se não concordar com algum destes termos, deve cessar imediatamente a utilização deste site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Uso Autorizado e Licença</h2>
            <p className="mb-2">É concedida permissão para visualizar temporariamente os materiais (informações, software ou conteúdos gráficos) no site da {brandName} apenas para uso pessoal, não comercial e transitório. Esta é uma concessão de licença, não uma transferência de título, e sob esta licença o utilizador não pode:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Modificar ou copiar os materiais;</li>
              <li>Utilizar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
              <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
              <li>Remover quaisquer direitos de autor ou outras anotações de propriedade dos materiais;</li>
              <li>Transferir os materiais para outra pessoa ou &quot;espelhar&quot; os materiais em qualquer outro servidor.</li>
            </ul>
             <p className="mt-2">
              Esta licença será automaticamente terminada se o utilizador violar alguma destas restrições e poderá ser terminada pela {brandName} a qualquer momento.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Isenção de Responsabilidade</h2>
            <p>
              Os materiais no site da {brandName} são fornecidos &quot;como estão&quot;. A {brandName} procura garantir a exatidão e atualização da informação (preços, áreas, características dos imóveis), mas não garante, expressa ou implicitamente, a precisão completa ou fiabilidade dos materiais. 
            </p>
            <p className="mt-2 text-sm text-gray-500">
              * Nota: Todas as informações sobre imóveis estão sujeitas a confirmação e não dispensam a consulta da documentação oficial.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Limitação de Responsabilidade</h2>
            <p>
              Em caso algum a {brandName} ou os seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucros, ou devido a interrupção da atividade) decorrentes do uso ou da incapacidade de usar os materiais no site da {brandName}, mesmo que a {brandName} tenha sido notificada da possibilidade de tais danos.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Precisão dos Materiais</h2>
            <p>
              Os materiais exibidos no site da {brandName} podem incluir erros técnicos, tipográficos ou fotográficos. A {brandName} pode fazer alterações nos materiais contidos no seu site a qualquer momento, sem aviso prévio, mas não se compromete a atualizar os materiais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Links para Terceiros</h2>
            <p>
              A {brandName} não reviu todos os sites ligados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica o endosso pela {brandName}. O uso de qualquer site vinculado é por conta e risco do utilizador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Modificações</h2>
            <p>
              A {brandName} pode rever estes termos de serviço para o seu site a qualquer momento, sem aviso prévio. Ao usar este site, o utilizador concorda em ficar vinculado à versão atual destes Termos e Condições de Utilização.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Lei Aplicável</h2>
            <p>
              Estes termos e condições são regidos e interpretados de acordo com a lei Portuguesa e o utilizador submete-se irrevogavelmente à jurisdição exclusiva dos tribunais portugueses.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
