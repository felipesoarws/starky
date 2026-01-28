import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  canonical?: string;
}

export default function SEO({
  title,
  description,
  name = 'Starky',
  type = 'website',
  canonical
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
