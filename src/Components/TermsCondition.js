import React from "react";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";

const TermsCondition = () => {
  return (
    <>
      <MainHeader />
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
              CareerRoadAI - Terms and Conditions
            </h1>

            <div className="space-y-6 text-gray-700">
              {/* Sections */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Introduction
                </h2>
                <p className="text-base leading-relaxed">
                  Welcome to CareerRoadAI! These Terms and Conditions ("Terms")
                  govern your access to and use of the CareerRoadAI platform,
                  including any services, content, and features provided through
                  the app. By accessing or using CareerRoadAI, you agree to
                  comply with and be bound by these Terms. If you do not agree
                  to all of these Terms, you may not use the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  2. User Accounts
                </h2>
                <p className="text-base leading-relaxed">
                  Users must provide accurate and complete information during
                  sign-up. You are responsible for maintaining the
                  confidentiality of your login credentials and for any activity
                  occurring under your account. You may sign up or log in via
                  email/password or third-party providers like Google.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Use of AI-Generated Roadmaps
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI uses artificial intelligence to generate learning
                  roadmaps based on the information provided by users. The
                  roadmap suggestions are for informational purposes only and do
                  not constitute professional advice. Users agree to use
                  AI-generated content responsibly and acknowledge that
                  CareerRoadAI cannot guarantee the accuracy or completeness of
                  the roadmap or content.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  4.Content
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI provides educational content, including videos,
                  articles, and links: The content shared on the app is curated
                  from non-copyrighted YouTube videos and publicly available
                  free content on the internet. CareerRoadAI does not own or
                  host this content. All copyrights remain with the respective
                  owners. Users may not reproduce, modify, or redistribute the
                  content outside of the CareerRoadAI platform.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  5. User Responsibilities
                </h2>
                <p className="text-base leading-relaxed">
                  While using CareerRoadAI, you agree: To use the platform only
                  for personal and educational purposes. Not to engage in
                  illegal activities, misuse, or disrupt the platform. Not to
                  upload or share inappropriate, offensive, or copyrighted
                  material. To provide honest answers when interacting with the
                  AI for generating roadmaps.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  6. Third-Party Content
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI may contain links to third-party websites or
                  content (e.g., YouTube videos). CareerRoadAI is not
                  responsible for the content, policies, or practices of
                  third-party sites. Users access them at their own risk.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  7. Data Collection and Privacy
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI collects user data such as email, login details,
                  and roadmap responses. User data is handled in compliance with
                  our Privacy Policy. Google login users are subject to Google’s
                  privacy policies in addition to CareerRoadAI’s terms.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  8. Limitation of Liability
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI is provided "as-is" without any warranties or
                  guarantees of accuracy, availability, or performance.
                  CareerRoadAI shall not be liable for any indirect, incidental,
                  or consequential damages resulting from the use of the
                  platform or its content.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  9. Termination
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI reserves the right to suspend or terminate any
                  user account that violates these Terms. Users may delete their
                  accounts at any time by contacting support.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  10. Changes to Terms
                </h2>
                <p className="text-base leading-relaxed">
                  CareerRoadAI reserves the right to modify these Terms at any
                  time. Users will be notified of updates, and continued use of
                  the app constitutes acceptance of the new Terms.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  11. Governing Law
                </h2>
                <p className="text-base leading-relaxed">
                  These Terms are governed by and construed in accordance with
                  the laws of India.
                </p>
              </section>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
                <p className="text-blue-700">
                  <strong>Contact Us:</strong> For any questions or concerns
                  about these Terms, please contact us at{" "}
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

export default TermsCondition;
