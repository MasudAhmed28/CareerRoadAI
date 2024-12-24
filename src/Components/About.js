import React, { useContext } from "react";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import { GithubIcon, LinkedinIcon, MailIcon, GlobeIcon } from "lucide-react";
import profilePic from "./Images/profilephoto.jpeg";
import { DataContext } from "./Contexts/DataContext";
import LoadSpinner from "./LoadSpinner";

const About = () => {
  const { loading } = useContext(DataContext);

  if (loading) {
    return <LoadSpinner text={"Loading "} />;
  }
  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-8">
            {/* About Us Section */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              About CareerRoadAI
            </h1>
            <p className="text-gray-700 leading-relaxed mb-6 text-center">
              CareerRoadAI is dedicated to empowering individuals to make
              informed career decisions using state-of-the-art artificial
              intelligence tools. We aim to simplify complex career challenges,
              helping people unlock their potential and achieve their goals.
            </p>

            {/* Mission Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to bridge the gap between aspirations and
                opportunities by providing personalized career guidance,
                resources, and tools tailored to individual needs.
              </p>
            </div>

            {/* Vision Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To become the leading global platform for career growth and
                development, helping millions of users worldwide to navigate
                their career paths successfully.
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Meet the Team
              </h2>
              <div className="space-y-6">
                {/* Team Member 1 */}
                <div className="flex items-center space-x-4">
                  <img
                    src={profilePic} // Replace with the actual image URL
                    alt="Masud Ahmed"
                    className="w-16 h-16 rounded-full shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      Masud Ahmed
                    </h3>
                    <p className="text-gray-700">Founder & Lead Developer</p>
                  </div>
                </div>

                {/* Team Member 2 (example) */}

                {/* Add more team members here */}
              </div>
            </div>

            {/* Connect Section */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Connect With Us
              </h2>
              <div className="flex justify-center space-x-6">
                {/* GitHub */}
                <a
                  href="https://github.com/MasudAhmed28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  <GithubIcon size={32} />
                  <span className="sr-only">GitHub</span>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/masud-ahmed-a70822178/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  <LinkedinIcon size={32} />
                  <span className="sr-only">LinkedIn</span>
                </a>
                {/* Email */}
                <a
                  href="mailto:masudahmedwork@gmail.com"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  <MailIcon size={32} />
                  <span className="sr-only">Email</span>
                </a>
                {/* Portfolio */}
                <a
                  href="https://masudahmedportfolio.netlify.app/" // Replace with your actual portfolio link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  <GlobeIcon size={32} />
                  <span className="sr-only">Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default About;
