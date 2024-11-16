import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaFacebookMessenger,
  FaTwitter,
  FaLinkedin,
  FaRegClipboard,
  FaClipboardCheck,
  FaShare,
  FaFacebook,
} from "react-icons/fa";

const ShareButton = ({ text, url, image }: { text: string; url: string; image: string }) => {
  const [shareNow, setShareNow] = useState(false);
  const message = encodeURIComponent(`${text}\n${url}`);

  useEffect(() => {
    const setMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property='${property}']`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('og:title', text);
    setMetaTag('og:description', text);
    setMetaTag('og:image', image);
    setMetaTag('og:url', url);
    setMetaTag('og:type', 'website');

    // Cleanup function to remove meta tags if needed
    return () => {
      document.querySelectorAll("meta[property^='og:']").forEach((element) => {
        document.head.removeChild(element);
      });
    };
  }, [text, url, image]);

  // Social media share handlers
  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleMessengerShare = () => {
    window.open(
      `fb-messenger://share/?link=${encodeURIComponent(url)}&app_id=435899319314263`,
      "_blank"
    );
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${message}`, "_blank");
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  const handleShareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  // Clipboard functionality
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div>
      {/* Main Share Button */}
      <button
        className="px-3 py-1 text-white rounded-md flex gap-1 bg-blue-400 font-semibold mx-auto"
        onClick={() => setShareNow(!shareNow)}
      >
        <span> Share {!shareNow && <span> Now </span>} </span>
        <FaShare size={24} />
      </button>

      {/* Share Options Section */}
      {shareNow && (
        <section className="my-2">
          <div className="flex flex-col items-center justify-center bg-gray-100 py-2 ">
            <h1 className="text-2xl font-bold mb-4">Share this content</h1>
            {/* Image Preview */}
            {image && (
              <img
                src={image}
                alt="Preview"
                className="w-32 h-32 object-cover mb-4 rounded-md"
              />
            )}
            <div className="flex space-x-4 py-3">
              <button
                onClick={handleShareOnFacebook}
                className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <FaFacebook size={24} />
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <FaWhatsapp size={24} />
              </button>
              <button
                onClick={handleMessengerShare}
                className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <FaFacebookMessenger size={24} />
              </button>
              <button
                onClick={handleTwitterShare}
                className="flex items-center justify-center p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
              >
                <FaTwitter size={24} />
              </button>
              <button
                onClick={handleLinkedInShare}
                className="flex items-center justify-center p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
              >
                <FaLinkedin size={24} />
              </button>
            </div>
          </div>

          {/* Copy URL Section */}
          <div className="flex flex-col items-center justify-center bg-gray-100 mb-2 py-2">
            <h1 className="text-xl font-bold mb-4">Copy this URL</h1>
            <div className="flex items-center justify-center">
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ${
                  copied ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                {copied ? (
                  <FaClipboardCheck size={24} />
                ) : (
                  <FaRegClipboard size={16} />
                )}
                <span className="ml-2">{copied ? "Copied!" : "Copy URL"}</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ShareButton;