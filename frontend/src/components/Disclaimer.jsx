import React from "react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#EAF7FC] py-12 px-5">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-[#DCE6EF] p-8">

        {/* MAIN HEADING */}
        <h2
          className="text-2xl font-bold text-white mb-8
                     bg-gradient-to-r from-[#0a4b78] to-[#2d92c8]
                     px-6 py-5 rounded-lg shadow-md text-center">
          Disclaimer – DIVYANSH GLOBAL RO
        </h2>

        {/* CONTENT */}
        <div className="space-y-6 text-gray-700 leading-relaxed">

          <p>
            The website (“Site”) and all content, materials, information, and
            services available on it are provided on an{" "}
            <span className="font-semibold">“as is”</span> and{" "}
            <span className="font-semibold">“as available”</span> basis.
          </p>

          <p>
            DIVYANSH GLOBAL RO explicitly disclaims all warranties, whether
            express or implied, including but not limited to:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Implied warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
          </ul>

          <p>
            While every effort has been made to ensure the accuracy, reliability,
            and authenticity of the information provided on this Site,
            DIVYANSH GLOBAL RO assumes no responsibility or liability for any
            errors, inaccuracies, or omissions.
          </p>

          <p>
            We do not guarantee that the information on this Site will always be
            complete, correct, or up to date.
          </p>

          <p>
            Users are advised to exercise their own discretion before relying on
            any content available on the Site. DIVYANSH GLOBAL RO shall not be
            held responsible for any loss, damage, or inconvenience arising from
            the use of or reliance on such information, materials, or services.
          </p>

        </div>
      </div>
    </div>
  );
}