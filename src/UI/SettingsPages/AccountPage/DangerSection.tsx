import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Checkbox, FormControl, Modal, ModalDialog } from "@mui/joy"
import classNames from "classnames"
import { AnimatePresence, motion } from "framer-motion"
import { ChangeEvent, useState } from "react"

import { useAppContext } from "../../../AppContext.tsx"
import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"
import { deleteUser } from "../../../Data/Backend/Apis/UsersApi.ts"
import { ActionsFromAppUrl, AppUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./DangerSection.scss"

const modalMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function DangerSection() {
  const navigate = useNavigate()
  const loggedInUser = useAppContext().loggedInUser?.user

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [shouldAlsoDeletePosts, setShouldAlsoDeletePosts] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleAlsoDeletePostsCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShouldAlsoDeletePosts(event.target.checked)
  }

  const handleConfirmDeleteClick = async () => {
    if (!loggedInUser) {
      return
    }

    setIsDeletingAccount(true)
    await deleteUser(loggedInUser, shouldAlsoDeletePosts)
    navigate(`/?${AppUrlQueryParam.ACTION}=${ActionsFromAppUrl.SIGN_OUT}`)
  }

  return (
    <>
      <section className="bordered danger">
        <h2>Danger Zone</h2>

        <div className="button-wrapper">
          <button className="button filled danger" onClick={() => setIsDeleteDialogOpen(true)}>
            <span>Delete account</span>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isDeleteDialogOpen && (
          <Modal open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <motion.div
              initial={modalMotionVariants.initial}
              animate={modalMotionVariants.animate}
              exit={modalMotionVariants.initial}
              transition={{ duration: Number(s.animationDurationXs) }}
            >
              <ModalDialog>
                <button className="button icon-only close" aria-label="close" onClick={() => setIsDeleteDialogOpen(false)}>
                  <FontAwesomeIcon icon={faXmark}/>
                </button>
                <div>
                  <span>Are you sure? Deletion is final.</span>
                  <FormControl id="delete-posts">
                    <Checkbox
                      label="Also delete all my posts"
                      variant="soft"
                      color="primary"
                      checked={shouldAlsoDeletePosts}
                      onChange={handleAlsoDeletePostsCheckboxChange}
                    />
                  </FormControl>
                  <button
                    className={classNames("button filled fixed-height danger", { loading: isDeletingAccount })}
                    disabled={isDeletingAccount}
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={handleConfirmDeleteClick}
                  >
                    {isDeletingAccount && <ButtonLoader/>}
                    <span>Delete my account</span>
                  </button>
                </div>
              </ModalDialog>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
