import React, { useContext } from "react";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import { DataContext } from "./Contexts/DataContext";
import LoadSpinner from "./LoadSpinner";

const PrivacyPolicy = () => {
  const { loading } = useContext(DataContext);

  if (loading) {
    return <LoadSpinner text={"Loading "} />;
  }
  return (
    <>
      <MainHeader />
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
              CareerRoadAI - Privacy Policy
            </h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-base leading-relaxed">
                  We collect personal information such as your name, email
                  address, and login details. Additionally, we may collect
                  information you provide when generating roadmaps.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-base leading-relaxed">
                  The information we collect is used to personalize your
                  experience and improve the app. We may also use your
                  information to send notifications related to your account and
                  services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Data Security
                </h2>
                <p className="text-base leading-relaxed">
                  We implement industry-standard security measures to protect
                  your personal information. However, no method of transmission
                  over the internet is 100% secure, and we cannot guarantee
                  complete security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  4. Sharing Your Information
                </h2>
                <p className="text-base leading-relaxed">
                  We do not sell, rent, or share your personal information with
                  third parties except for trusted service providers who assist
                  in running the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  5. Your Rights
                </h2>
                <p className="text-base leading-relaxed">
                  You have the right to access, update, or delete your personal
                  information. If you wish to exercise any of these rights,
                  please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  6. Changes to This Policy
                </h2>
                <p className="text-base leading-relaxed">
                  We may update this Privacy Policy from time to time. Any
                  changes will be posted on this page, and the updated date will
                  be indicated at the top of the policy.
                </p>
              </section>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
                <p className="text-blue-700">
                  <strong>Contact Us:</strong> For any questions or concerns
                  about this Privacy Policy, please contact us at{" "}
                  <a
                    href="mailto:support@CareerRoadAI.com"
                    className="underline"
                  >
                    support@CareerRoadAI.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default PrivacyPolicy;
