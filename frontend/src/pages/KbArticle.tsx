import { ArrowLeft, Clock, Mail, ArrowRight, BookOpen } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { getArticle, relatedArticles } from '@/data/support/kbArticles';
import { goBack } from '@/data/support/navigation';
import HelpfulSurvey from '../components/support/HelpfulSurvey';

const KbArticle = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Artikel tidak ditemukan</h1>
          <p className="mb-6 text-sm text-gray-600">
            Artikel yang Anda cari tidak ada atau sudah dipindahkan.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => goBack(navigate, '/kb')}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Kembali
            </button>
            <Link
              to="/kb"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Semua Artikel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const related = relatedArticles(article.slug);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-sm">
            <button
              onClick={() => goBack(navigate, '/kb')}
              className="inline-flex items-center gap-1.5 rounded-lg p-1.5 -ml-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
            <span className="text-gray-300">/</span>
            <Link to="/kb" className="font-medium text-blue-600 hover:underline">
              Pusat Pengetahuan
            </Link>
          </nav>
          <span className="mb-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {article.category}
          </span>
          <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} />
              {article.readMinutes} mnt baca
            </span>
            <span>Diperbarui {article.updatedAt}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="space-y-7 p-6 sm:p-8">
            {article.sections.map((s, i) => (
              <section key={i}>
                <h2 className="mb-2 text-lg font-bold text-gray-900">{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="mb-2 text-sm leading-relaxed text-gray-700">
                    {p}
                  </p>
                ))}
                {s.steps && (
                  <ol className="mt-3 space-y-2">
                    {s.steps.map((step, k) => (
                      <li key={k} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {k + 1}
                        </span>
                        <span className="leading-relaxed text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </CardContent>
        </Card>

        <HelpfulSurvey
          topic={`kb-${article.slug}`}
          question="Apakah artikel ini membantu?"
        />

        {related.length > 0 && (
          <div>
            <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Artikel terkait
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} to={`/kb/${r.slug}`} className="group">
                  <Card className="h-full border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                    <CardContent className="p-5">
                      <BookOpen size={20} className="mb-2 text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700">
                        {r.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-600">
                        {r.excerpt}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                        Baca
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
          <h3 className="mb-1 text-base font-bold text-gray-900">Masih belum terjawab?</h3>
          <p className="mb-4 text-sm text-gray-600">
            Tim support kami siap membantu dalam 1×24 jam
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            <Mail size={18} />
            <span>Hubungi Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KbArticle;
