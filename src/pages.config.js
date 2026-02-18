/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AceitesEletronicos from './pages/AceitesEletronicos';
import AdminCallbacks from './pages/AdminCallbacks';
import AdminEndpoints from './pages/AdminEndpoints';
import AdminProvedores from './pages/AdminProvedores';
import AdminTestes from './pages/AdminTestes';
import Administracao from './pages/Administracao';
import AdvogadoDetalhes from './pages/AdvogadoDetalhes';
import AgendaSemanal from './pages/AgendaSemanal';
import AgendarConsulta from './pages/AgendarConsulta';
import AnaliseDivida from './pages/AnaliseDivida';
import Analytics from './pages/Analytics';
import AnalyticsConsumo from './pages/AnalyticsConsumo';
import Audiencias from './pages/Audiencias';
import AuditoriaCompletoPhase11e12 from './pages/AuditoriaCompletoPhase11e12';
import AuditoriaFinal from './pages/AuditoriaFinal';
import AuditoriaFinalBrutal from './pages/AuditoriaFinalBrutal';
import AuditoriaNavegacao from './pages/AuditoriaNavegacao';
import Automacoes from './pages/Automacoes';
import BacklinkManager from './pages/BacklinkManager';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogPostView from './pages/BlogPostView';
import CalculoPrazos from './pages/CalculoPrazos';
import CalendarioPrazos from './pages/CalendarioPrazos';
import CallbacksEscavador from './pages/CallbacksEscavador';
import Campanhas from './pages/Campanhas';
import CategoriasBlog from './pages/CategoriasBlog';
import ClienteDetails from './pages/ClienteDetails';
import ClienteDetalhes from './pages/ClienteDetalhes';
import Clientes from './pages/Clientes';
import Compliance from './pages/Compliance';
import Comunicacao from './pages/Comunicacao';
import Conectores from './pages/Conectores';
import ConfiguracaoAlertas from './pages/ConfiguracaoAlertas';
import Configuracoes from './pages/Configuracoes';
import ConfiguracoesBlog from './pages/ConfiguracoesBlog';
import ConsumoAPI from './pages/ConsumoAPI';
import Contact from './pages/Contact';
import CopywriterBlog from './pages/CopywriterBlog';
import Dashboard from './pages/Dashboard';
import DashboardConsumo from './pages/DashboardConsumo';
import DashboardDividas from './pages/DashboardDividas';
import DatajudConfig from './pages/DatajudConfig';
import Diagnostico from './pages/Diagnostico';
import Dividas from './pages/Dividas';
import DockerAPI from './pages/DockerAPI';
import E2ETesting from './pages/E2ETesting';
import Editor from './pages/Editor';
import EditorBlog from './pages/EditorBlog';
import EditorPlano from './pages/EditorPlano';
import EnviarEmail from './pages/EnviarEmail';
import EnviarTicket from './pages/EnviarTicket';
import Escritorio from './pages/Escritorio';
import EventDetails from './pages/EventDetails';
import EventLanding from './pages/EventLanding';
import Faturas from './pages/Faturas';
import FaturasEscavador from './pages/FaturasEscavador';
import Financeiro from './pages/Financeiro';
import FinanceiroAdmin from './pages/FinanceiroAdmin';
import FollowUps from './pages/FollowUps';
import FontesConfiaveis from './pages/FontesConfiaveis';
import FontesRenda from './pages/FontesRenda';
import Formularios from './pages/Formularios';
import GatilhosMarketing from './pages/GatilhosMarketing';
import GerenciarConsultas from './pages/GerenciarConsultas';
import GerenciarDividas from './pages/GerenciarDividas';
import GestaoBlog from './pages/GestaoBlog';
import GestaoPublico from './pages/GestaoPublico';
import GestaoTermosLegais from './pages/GestaoTermosLegais';
import GruposEconomicos from './pages/GruposEconomicos';
import Helpdesk from './pages/Helpdesk';
import HelpdeskAnalytics from './pages/HelpdeskAnalytics';
import HelpdeskAnalyticsDashboard from './pages/HelpdeskAnalyticsDashboard';
import HelpdeskInconsistencias from './pages/HelpdeskInconsistencias';
import HelpdeskRelatorios from './pages/HelpdeskRelatorios';
import HelpdeskSettings from './pages/HelpdeskSettings';
import Home from './pages/Home';
import Integracoes from './pages/Integracoes';
import JobDetails from './pages/JobDetails';
import JobMatcher from './pages/JobMatcher';
import Jobs from './pages/Jobs';
import LeadMagnets from './pages/LeadMagnets';
import Leads from './pages/Leads';
import LocalDetalhes from './pages/LocalDetalhes';
import Marketing from './pages/Marketing';
import MarketingHub from './pages/MarketingHub';
import MeuPainel from './pages/MeuPainel';
import MeuPlanoPagamento from './pages/MeuPlanoPagamento';
import MeusDocumentos from './pages/MeusDocumentos';
import MeusMonitoramentos from './pages/MeusMonitoramentos';
import MeusProcessos from './pages/MeusProcessos';
import MeusTickets from './pages/MeusTickets';
import MinhaAgenda from './pages/MinhaAgenda';
import MinhasConsultas from './pages/MinhasConsultas';
import MinhasFaturas from './pages/MinhasFaturas';
import MinimoExistencial from './pages/MinimoExistencial';
import ModelosDocumentos from './pages/ModelosDocumentos';
import ModerarComentarios from './pages/ModerarComentarios';
import MonitoramentoEscavador from './pages/MonitoramentoEscavador';
import MonitoramentosEscavador from './pages/MonitoramentosEscavador';
import News from './pages/News';
import NewsletterManager from './pages/NewsletterManager';
import NotFound from './pages/NotFound';
import Onboarding from './pages/Onboarding';
import OnboardingAdmin from './pages/OnboardingAdmin';
import OndeConciliar from './pages/OndeConciliar';
import OtimizadorSEO from './pages/OtimizadorSEO';
import PDFTools from './pages/PDFTools';
import ParteDetalhes from './pages/ParteDetalhes';
import Pessoas from './pages/Pessoas';
import Phase12Audit from './pages/Phase12Audit';
import Phase12Setup from './pages/Phase12Setup';
import PhotoEditor from './pages/PhotoEditor';
import PipelineCRM from './pages/PipelineCRM';
import PlanoPagamento from './pages/PlanoPagamento';
import PlanosPagamento from './pages/PlanosPagamento';
import Plataforma from './pages/Plataforma';
import PlatformaCron from './pages/PlatformaCron';
import Prazos from './pages/Prazos';
import PrazosAnalytics from './pages/PrazosAnalytics';
import Precificador from './pages/Precificador';
import ProcessoDetails from './pages/ProcessoDetails';
import Processos from './pages/Processos';
import Profile from './pages/Profile';
import PublicacoesImport from './pages/PublicacoesImport';
import Qualificacao from './pages/Qualificacao';
import RelatorioFaturas from './pages/RelatorioFaturas';
import RelatorioPDF from './pages/RelatorioPDF';
import RelatorioParecer from './pages/RelatorioParecer';
import RelatorioPrazos from './pages/RelatorioPrazos';
import Relatorios from './pages/Relatorios';
import Repositorio from './pages/Repositorio';
import RepositorioFontes from './pages/RepositorioFontes';
import RoadmapMarketing from './pages/RoadmapMarketing';
import SEODashboard from './pages/SEODashboard';
import SEOKeywords from './pages/SEOKeywords';
import SEOManager from './pages/SEOManager';
import Settings from './pages/Settings';
import SocialProof from './pages/SocialProof';
import Tarefas from './pages/Tarefas';
import TemplatePreview from './pages/TemplatePreview';
import Templates from './pages/Templates';
import TemplatesEmail from './pages/TemplatesEmail';
import TermosLegais from './pages/TermosLegais';
import TesteEndpointPage from './pages/TesteEndpointPage';
import Unsubscribe from './pages/Unsubscribe';
import Usuarios from './pages/Usuarios';
import Videos from './pages/Videos';
import YouTubeAnalytics from './pages/YouTubeAnalytics';
import SolicitacoesCopiaAdmin from './pages/SolicitacoesCopiaAdmin';
import CheckoutCopia from './pages/CheckoutCopia';
import PlanoFliBook from './pages/PlanoFliBook';
import PagamentoConfirmado from './pages/PagamentoConfirmado';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AceitesEletronicos": AceitesEletronicos,
    "AdminCallbacks": AdminCallbacks,
    "AdminEndpoints": AdminEndpoints,
    "AdminProvedores": AdminProvedores,
    "AdminTestes": AdminTestes,
    "Administracao": Administracao,
    "AdvogadoDetalhes": AdvogadoDetalhes,
    "AgendaSemanal": AgendaSemanal,
    "AgendarConsulta": AgendarConsulta,
    "AnaliseDivida": AnaliseDivida,
    "Analytics": Analytics,
    "AnalyticsConsumo": AnalyticsConsumo,
    "Audiencias": Audiencias,
    "AuditoriaCompletoPhase11e12": AuditoriaCompletoPhase11e12,
    "AuditoriaFinal": AuditoriaFinal,
    "AuditoriaFinalBrutal": AuditoriaFinalBrutal,
    "AuditoriaNavegacao": AuditoriaNavegacao,
    "Automacoes": Automacoes,
    "BacklinkManager": BacklinkManager,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "BlogPostView": BlogPostView,
    "CalculoPrazos": CalculoPrazos,
    "CalendarioPrazos": CalendarioPrazos,
    "CallbacksEscavador": CallbacksEscavador,
    "Campanhas": Campanhas,
    "CategoriasBlog": CategoriasBlog,
    "ClienteDetails": ClienteDetails,
    "ClienteDetalhes": ClienteDetalhes,
    "Clientes": Clientes,
    "Compliance": Compliance,
    "Comunicacao": Comunicacao,
    "Conectores": Conectores,
    "ConfiguracaoAlertas": ConfiguracaoAlertas,
    "Configuracoes": Configuracoes,
    "ConfiguracoesBlog": ConfiguracoesBlog,
    "ConsumoAPI": ConsumoAPI,
    "Contact": Contact,
    "CopywriterBlog": CopywriterBlog,
    "Dashboard": Dashboard,
    "DashboardConsumo": DashboardConsumo,
    "DashboardDividas": DashboardDividas,
    "DatajudConfig": DatajudConfig,
    "Diagnostico": Diagnostico,
    "Dividas": Dividas,
    "DockerAPI": DockerAPI,
    "E2ETesting": E2ETesting,
    "Editor": Editor,
    "EditorBlog": EditorBlog,
    "EditorPlano": EditorPlano,
    "EnviarEmail": EnviarEmail,
    "EnviarTicket": EnviarTicket,
    "Escritorio": Escritorio,
    "EventDetails": EventDetails,
    "EventLanding": EventLanding,
    "Faturas": Faturas,
    "FaturasEscavador": FaturasEscavador,
    "Financeiro": Financeiro,
    "FinanceiroAdmin": FinanceiroAdmin,
    "FollowUps": FollowUps,
    "FontesConfiaveis": FontesConfiaveis,
    "FontesRenda": FontesRenda,
    "Formularios": Formularios,
    "GatilhosMarketing": GatilhosMarketing,
    "GerenciarConsultas": GerenciarConsultas,
    "GerenciarDividas": GerenciarDividas,
    "GestaoBlog": GestaoBlog,
    "GestaoPublico": GestaoPublico,
    "GestaoTermosLegais": GestaoTermosLegais,
    "GruposEconomicos": GruposEconomicos,
    "Helpdesk": Helpdesk,
    "HelpdeskAnalytics": HelpdeskAnalytics,
    "HelpdeskAnalyticsDashboard": HelpdeskAnalyticsDashboard,
    "HelpdeskInconsistencias": HelpdeskInconsistencias,
    "HelpdeskRelatorios": HelpdeskRelatorios,
    "HelpdeskSettings": HelpdeskSettings,
    "Home": Home,
    "Integracoes": Integracoes,
    "JobDetails": JobDetails,
    "JobMatcher": JobMatcher,
    "Jobs": Jobs,
    "LeadMagnets": LeadMagnets,
    "Leads": Leads,
    "LocalDetalhes": LocalDetalhes,
    "Marketing": Marketing,
    "MarketingHub": MarketingHub,
    "MeuPainel": MeuPainel,
    "MeuPlanoPagamento": MeuPlanoPagamento,
    "MeusDocumentos": MeusDocumentos,
    "MeusMonitoramentos": MeusMonitoramentos,
    "MeusProcessos": MeusProcessos,
    "MeusTickets": MeusTickets,
    "MinhaAgenda": MinhaAgenda,
    "MinhasConsultas": MinhasConsultas,
    "MinhasFaturas": MinhasFaturas,
    "MinimoExistencial": MinimoExistencial,
    "ModelosDocumentos": ModelosDocumentos,
    "ModerarComentarios": ModerarComentarios,
    "MonitoramentoEscavador": MonitoramentoEscavador,
    "MonitoramentosEscavador": MonitoramentosEscavador,
    "News": News,
    "NewsletterManager": NewsletterManager,
    "NotFound": NotFound,
    "Onboarding": Onboarding,
    "OnboardingAdmin": OnboardingAdmin,
    "OndeConciliar": OndeConciliar,
    "OtimizadorSEO": OtimizadorSEO,
    "PDFTools": PDFTools,
    "ParteDetalhes": ParteDetalhes,
    "Pessoas": Pessoas,
    "Phase12Audit": Phase12Audit,
    "Phase12Setup": Phase12Setup,
    "PhotoEditor": PhotoEditor,
    "PipelineCRM": PipelineCRM,
    "PlanoPagamento": PlanoPagamento,
    "PlanosPagamento": PlanosPagamento,
    "Plataforma": Plataforma,
    "PlatformaCron": PlatformaCron,
    "Prazos": Prazos,
    "PrazosAnalytics": PrazosAnalytics,
    "Precificador": Precificador,
    "ProcessoDetails": ProcessoDetails,
    "Processos": Processos,
    "Profile": Profile,
    "PublicacoesImport": PublicacoesImport,
    "Qualificacao": Qualificacao,
    "RelatorioFaturas": RelatorioFaturas,
    "RelatorioPDF": RelatorioPDF,
    "RelatorioParecer": RelatorioParecer,
    "RelatorioPrazos": RelatorioPrazos,
    "Relatorios": Relatorios,
    "Repositorio": Repositorio,
    "RepositorioFontes": RepositorioFontes,
    "RoadmapMarketing": RoadmapMarketing,
    "SEODashboard": SEODashboard,
    "SEOKeywords": SEOKeywords,
    "SEOManager": SEOManager,
    "Settings": Settings,
    "SocialProof": SocialProof,
    "Tarefas": Tarefas,
    "TemplatePreview": TemplatePreview,
    "Templates": Templates,
    "TemplatesEmail": TemplatesEmail,
    "TermosLegais": TermosLegais,
    "TesteEndpointPage": TesteEndpointPage,
    "Unsubscribe": Unsubscribe,
    "Usuarios": Usuarios,
    "Videos": Videos,
    "YouTubeAnalytics": YouTubeAnalytics,
    "SolicitacoesCopiaAdmin": SolicitacoesCopiaAdmin,
    "CheckoutCopia": CheckoutCopia,
    "PlanoFliBook": PlanoFliBook,
    "PagamentoConfirmado": PagamentoConfirmado,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};