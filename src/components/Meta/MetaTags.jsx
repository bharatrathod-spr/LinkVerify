import { Helmet } from "react-helmet-async";
import logo from "../../assets/svg/logo.svg";

const MetaTags = ({
  title = "TrackBacklinks",
  description = "TrackBacklinks is an advanced SEO tool designed to analyze and validate the links on your website, ensuring they contribute positively to your SEO efforts. It helps identify broken links, verifies metadata accuracy, and checks overall link health, enabling you to optimize your site for search engines and improve user experience.",

  keywords = "SEO audit tool, website link checker, link health checker, link optimization tool, broken link detection, link validation tool, SEO link health, metadata checker, SEO crawler, link analysis tool, URL checker, website SEO validation, website optimization, link structure analysis, metadata optimization, metadata verification, URL validation",
}) => (
  <Helmet>
    <link rel="icon" href={logo} />
    <title>{title ? `${title} | TrackBacklinks` : ""}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
  </Helmet>
);

export default MetaTags;
