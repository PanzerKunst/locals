import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Modal, ModalDialog } from "@mui/joy"
import { faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useAppContext } from "../../../AppContext.tsx"
import { deleteUser } from "../../../Data/Backend/Apis/UsersApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { FadeIn } from "../../_CommonComponents/FadeIn.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

const modalMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function DangerZoneSection() {
  const navigate = useNavigate()
  const { loggedInUser } = useAppContext()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleConfirmDeleteClick = async () => {
    if (!loggedInUser) {
      return
    }

    await deleteUser(loggedInUser)
    setIsDeleteDialogOpen(false)
    navigate(`/?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.SIGN_OUT}`)
  }

  return (
    <section>
      <FadeIn>
        <h2>Danger zone</h2>
      </FadeIn>
      <FadeIn className="wrapper-next-button">
        <button className="button filled" onClick={() => setIsDeleteDialogOpen(true)}>
          <span>Delete account</span>
        </button>
      </FadeIn>

      <AnimatePresence>
        {isDeleteDialogOpen && (
          <Modal open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <motion.div
              initial={modalMotionVariants.initial}
              animate={modalMotionVariants.animate}
              exit={modalMotionVariants.initial}
              transition={{ duration: Number(s.animationDurationSm) }}
            >
              <ModalDialog>
                <button className="button icon-only close" aria-label="close" onClick={() => setIsDeleteDialogOpen(false)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <div>
                  <span>Are you sure? Deletion is final.</span>
                  {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                  <button className="button filled fixed-height" onClick={handleConfirmDeleteClick}>
                    <FontAwesomeIcon icon={faTrashCan} />
                    <span>Delete my account</span>
                  </button>
                </div>
              </ModalDialog>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  )
}
