import { FaLinkedinIn } from 'react-icons/fa'
import { FaYoutube } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="flex justify-center items-center h-[190px] rounded-t-3xl bg-white bg-opacity-20">
      <div className="flex flex-col items-center w-[450px]">
        <section className="flex items-center gap-5 text-white">
          <FaLinkedinIn size={27} />
          <FaYoutube size={27} />
          <FaGithub size={27} />
          <FaTwitter size={27} />
        </section>
        <hr className="mt-4 mb-6 w-full border-t border-solid border-gray-400" />
        <section className="text-white">
          <p className="text-center">&copy;2024</p>
          <p>With Love ❤️ by Daltonic</p>
        </section>
      </div>
    </footer>
  )
}

export default Footer
