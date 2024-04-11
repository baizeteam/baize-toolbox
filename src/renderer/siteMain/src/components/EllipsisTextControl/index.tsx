import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import "./index.less";
import classNames from "classnames";

interface EllipsisTextControlProps {
  /** 显示的文体内容 */
  content?: string | React.ReactChild;
  /** 显示的文体内容(计算长度) */
  contentText?: string;
  /** 控件的宽度 */
  width?: string | number;
  /** 控件的最大宽度 */
  maxWidth?: string | number;
  /** 控件的最大高度 */
  maxHeight?: string | number;
  /** 文本的样式class */
  contentClassName?: string;
  /** 提示内容的样式class */
  tooltipsClassName?: string;
  /** 渲染节点 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** 省略类型：多行文本省略，单行文本省略，枚举值：single|multiple，默认单行 */
  type?: "single" | "multiple";
  /** 是否需要显示tip，默认为true */
  showTooltip?: boolean;
  /** 扩展需要特殊处理的 hovertitle */
  tooltipTitle?: JSX.Element;
  /** 气泡框位置 */
  placement?: TooltipPlacement;
  /** 多行时最后附加的内容 */
  endContent?: string | JSX.Element;
}

type OptionProps = {
  open?: boolean;
};

const EllipsisTextControl = ({
  content,
  contentText,
  width,
  maxWidth,
  maxHeight,
  contentClassName,
  tooltipsClassName,
  getPopupContainer,
  type = "single",
  showTooltip = true,
  tooltipTitle,
  placement = "bottomLeft",
  endContent = "",
}: EllipsisTextControlProps) => {
  /** 主体显示的内容 */
  const ellipsisInputRef = useRef<HTMLDivElement>(null);
  /** 存放主体内容的容器 */
  const ellipsisContainerRef = useRef<HTMLDivElement>(null);
  const [optionProps, setOptionProps] = useState<OptionProps>(null);
  const [showLastEllipsis, setShowLastEllipsis] = useState(false);

  const trueContentText = (contentText || content) as string;

  useEffect(() => {
    judgeShouldShowTip();
  }, [maxHeight, maxWidth, width, trueContentText]);

  // 获取最大能够显示到的字符数（二分法）
  const getMaxLength = () => {
    const ellipsisInput = ellipsisInputRef.current;
    const ellipsisContainer = ellipsisContainerRef.current;
    const offsetHeight = ellipsisContainer.offsetHeight;
    let left = 0,
      right = trueContentText?.length;
    let result = 0;
    while (left <= right) {
      const middle = Math.ceil((left + right) / 2);
      ellipsisInput.innerHTML = trueContentText.slice(0, middle);
      if (ellipsisContainer.scrollHeight > offsetHeight) {
        right = middle - 1;
      } else {
        result = middle;
        left = middle + 1;
      }
    }
    return result;
  };

  /**
   * 处理是否hover上去显示tip
   * @params value: 是否隐藏tip
   */
  const handleHidePopupTip = (value: boolean) => {
    if (value) {
      setOptionProps({ open: false });
    } else {
      //  此时情形为文字更改后出现省略，则显示tooltip
      if (optionProps?.open === false) {
        setOptionProps({});
      }
    }
  };

  /** 处理单选 */
  const handleSingle = () => {
    const ellipsisContainer = ellipsisContainerRef.current;
    console.log(
      "%c [ ellipsisContainer ]-107",
      "font-size:13px; background:pink; color:#bf2c9f;",
      ellipsisContainer.offsetWidth,
      ellipsisContainer.scrollWidth,
    );
    // 说明没有超出范围
    if (ellipsisContainer.offsetWidth >= ellipsisContainer.scrollWidth) {
      handleHidePopupTip(true);
      return;
    }
    handleHidePopupTip(false);
  };

  /** 处理多选 */
  const handleMulitiple = () => {
    const ellipsisInput = ellipsisInputRef.current;
    const maxLength = getMaxLength();
    const isOver = maxLength < trueContentText.length;
    if (isOver) {
      if (contentText) {
        setShowLastEllipsis(true);
        return;
      }
      ellipsisInput.innerHTML = `${trueContentText.slice(
        0,
        maxLength - 3 > 0 ? maxLength - 3 : 1,
      )}...`;
      handleHidePopupTip(false);
      return;
    } else {
      setShowLastEllipsis(false);
    }
    handleHidePopupTip(true);
  };

  const judgeShouldShowTip = () => {
    // 在tooltip的源码中，如果props中显式给open赋值，就会导致之后的显隐都需要手动控制，这样就是去了选择tooltip文本的机会
    //  所以采用以下判断是否有缩略内容的时候才去是否显式设置open
    const ellipsisInput = ellipsisInputRef.current;
    const ellipsisContainer = ellipsisContainerRef.current;
    if (ellipsisInput && ellipsisContainer) {
      const map = {
        single: handleSingle,
        multiple: handleMulitiple,
      };
      map?.[type]?.();
    }
  };

  const style = {
    maxWidth: maxWidth ?? width ?? "none",
    width: width ?? "none",
    maxHeight: type === "multiple" ? maxHeight : "none",
  };

  return (
    <Tooltip
      overlayClassName={`ellipsis-tooltips ${
        tooltipsClassName ? tooltipsClassName : ""
      }`}
      title={tooltipTitle ?? content}
      placement={placement}
      {...optionProps}
      getPopupContainer={getPopupContainer}
      trigger={showTooltip ? "hover" : null}
    >
      <div
        ref={ellipsisContainerRef}
        style={style}
        className={classNames("ellipsis-text-container", {
          "ellipsis-text": type === "single",
          [contentClassName]: !!contentClassName,
        })}
      >
        {contentText ? (
          <>
            <div
              className={showLastEllipsis ? "last-ellipsis" : ""}
              style={{
                height: maxHeight,
                maxWidth: maxWidth,
              }}
            >
              {content}
            </div>
            {/* 该处用来计算长度，由于旧的组件是直接修改内容来计算是否超出 */}
            <div className="content-calculation" ref={ellipsisInputRef}>
              {content}
            </div>
          </>
        ) : (
          <span className="no-default-span" ref={ellipsisInputRef}>
            {content}
          </span>
        )}

        {type === "multiple" && endContent}
      </div>
    </Tooltip>
  );
};

export default React.memo(EllipsisTextControl);
