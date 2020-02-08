import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { motion, useAnimation, AnimatePresence } from "framer-motion"

const cssMainContainer = css`
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex: 1 1 auto;
  background-color: #2A5380;
`
const cssMenuContainer = css`
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
  max-width: 500px;
  margin: auto;
  @media screen and (min-width < 500px) {
  }
`
const cssToolbar = css`
  display: flex;
  height: 30px;
  & > div:first-of-type {
    display: flex;
    padding-left: 8px;
    align-items: center;
    width: 50%;
  }
  & > div:last-child {
    padding-right: 8px;
    width: 50%;
  }
`
const cssMenuInnerContainer = css`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  @media (max-width: 500px) {
    min-height: 100vh;
  }
`
const cssLayer = css`
  display: flex;
  flex-direction: column;
  min-width: 50%;
  max-width: 50%;
  border-left: 2px solid #54A7FF;
  &:first-of-type {
    border-left: none;
  }
  @media (max-width: 500px) {
    position: absolute;
    min-width: 100%;
    &:nth-of-type(2) {
      background-color: #ccc;
      top: 10px;
      bottom: 40px;
      left: 10px;
    }
    &:nth-of-type(3) {
      background-color: #ccc;
      top: 20px;
      bottom: 40px;
      left: 20px;
    }
    &:nth-of-type(4) {
      background-color: #ccc;
      top: 30px;
      bottom: 40px;
      left: 30px;
    }
  }
`
const cssLink = css`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 18px 24px;
  color: #fff;
  &:hover {
    background-color: #54A7FF;
  }
`;

const cssLinkHover = css`
  background-color: rgba(0,0,0, 0.3)
`

const walk = (leaf, flattenedTree = [], iteration = 0, level = 0) => {
  if (Array.isArray(leaf)) {
    // For each menu level, we consider it as a layer
    let currentLevel = level;
    leaf.forEach(mi => {
      const { children, ...rest } = mi;
      let childIndex = null;
      // Assign each link to layer
      if (!Array.isArray(flattenedTree[iteration])) {
        flattenedTree[iteration] = [];
      }
      // If link has children, recurse
      if (Array.isArray(children)) {
        let newIndex = ++iteration;
        ++currentLevel;
        // Avoid to set childs from a layer as same index (level) of other layer in the array
        childIndex = newIndex <= flattenedTree.length ? flattenedTree.length : newIndex;
        walk(children, flattenedTree, childIndex, currentLevel)
        iteration--
        currentLevel--
      }
      flattenedTree[iteration].push({ ...rest, childIndex, level: currentLevel });
    });
  }
  return flattenedTree;
};

const layerVariant = {
  visible: {
    from: 0,
    height: 'auto',
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
      duration: 0.3,
    }
  },
  hidden: {
    height: 0,
    transition: {
      duration: 2,
      when: 'afterChildren',
      staggerChildren: 0.1,
      duration: 0.2,
    }
  }
}

const linkVariant = {
  visible: {
    opacity: 1,
    x: 0
  },
  hidden: {
    opacity: 0,
    x: -5
  }
}

const Menu = ({ menu }) => {

  const [tree, setTree] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState([0])
  const [activeLinks, setActiveLinks] = useState([])
  const innerContainerControls = useAnimation()
  const [isMobile, setIsMobile] = useState((window.innerWidth < 500))

  /* Parse menu JSON object and flatten it for better performances */
  useEffect(() => {
    setTree(walk(menu));
  }, [menu])

  /* When displayed layers change, animate them */
  useEffect(() => {

    const transition = {
      type: 'spring',
      damping: 30,
      stiffness: 220,
    };

    // In tablet mode we can display 2 layers at the same time, 1 on mobile
    const count = isMobile ? visibleLayers.length - 1 : visibleLayers.length - 2;

    if (count > -1) {
      /* Tablet mode */
      if (!isMobile) {
        innerContainerControls.start({
          transition,
          // Slide container left and add border right to the calculation
          x: `calc(-${(visibleLayers.length - 2) * 50}% - ${(visibleLayers.length - 2) * 2}px)`
        })
      }
    }
  }, [visibleLayers])

  useEffect(() => {
    if (isMobile) {
      innerContainerControls.start({
        x: 0 
      })
    }
  }, [isMobile])

  useEffect(() => {
    const cb = () => {
      setIsMobile((window.innerWidth < 500))
    }
    window.addEventListener('resize', cb);
    return () => {
      window.removeEventListener('resize', cb)
    }
  }, [])

  const showSubMenu = (link, callerId) => {
    const { childIndex, level } = link
    // Define layers to be displayed and store them
    const copy = [...visibleLayers]
    if (visibleLayers[level] !== childIndex) {
      copy.splice(level + 1, copy.length);
    }
    if (childIndex) {
      const vl = [...copy, childIndex];
      setVisibleLayers(vl)
    }
    // Store active layers (for css essentialy)
    const c = [...activeLinks]
    c.splice(level, c.length)
    c[level] = callerId;
    setActiveLinks(c)
  }

  const back = () => {
    setVisibleLayers(visibleLayers.splice(0, visibleLayers.length - 1))
  }

  const getLinkCss = (id) => {
    const ret = [cssLink]
    if (activeLinks.indexOf(id) !== -1) {
      ret.push(cssLinkHover)
    }
    return ret
  }

  // If no tree avoid render, at least avoid first render
  if (tree.length === 0) {
    return null;
  }

  return (
    <div css={cssMainContainer}>
      <div css={cssMenuContainer}>
        <div css={cssToolbar}>
          <div>
            {(isMobile ? (visibleLayers.length > 1) : (visibleLayers.length > 2)) && <a href="#" onClick={back}>BACK</a>}
          </div>
          <div></div>
        </div>
        <motion.div css={cssMenuInnerContainer} animate={innerContainerControls}>
          <AnimatePresence>
            {tree.map((layer, i) => {
              if (visibleLayers.indexOf(i) !== -1) {
                return (
                  <motion.div key={i} exit="hidden" css={cssLayer} variants={layerVariant} initial={i == 0 ? "visible" : "hidden"} animate={i >= 0 ? "visible" : "hidden"}>
                    {layer.map((link, j) => (
                      <motion.a key={`${i}${j}`} css={() => getLinkCss(`${i}${j}`)} variants={linkVariant} onClick={() => showSubMenu(link, `${i}${j}`)}>
                        {link.label}
                        {link.childIndex && <div>></div>}
                      </motion.a>
                    ))}
                  </motion.div>
                )
              } else {
                return null
              }
            })
            }
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
};

export default Menu;

Menu.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.shape)
}
